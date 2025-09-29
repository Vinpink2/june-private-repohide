/**
 * june md Bot - A WhatsApp Bot
 * © 2025 supreme
 */

require('./settings')
const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main');
const PhoneNumber = require('awesome-phonenumber')
const { smsg } = require('./lib/myfunc')
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    jidDecode,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay 
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
const pino = require("pino")
const readline = require("readline")
const { rmSync } = require('fs')

// --- GLOBAL FLAGS ---
global.isBotConnected = false; 
global.connectDebounceTimeout = null;

// --- Lightweight store (JUNE MD) ---
const store = require('./lib/lightweight_store')
store.readFromFile()
const settings = require('./settings')
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000)

// --- MEMORY OPTIMIZATION (JUNE MD) ---
setInterval(() => { if (global.gc) { global.gc(); console.log('🧹 Garbage collection completed') } }, 60000)
setInterval(() => { if ((process.memoryUsage().rss / 1024 / 1024) > 400) { console.log('⚠️ RAM too high (>400MB), restarting bot...'); process.exit(1) } }, 30000)

// --- 🔒 MESSAGE STORAGE CONFIGURATION & HELPERS ---
const MESSAGE_STORE_FILE = path.join(__dirname, 'message_backup.json');
global.messageBackup = {};

function loadStoredMessages() {
    try {
        if (fs.existsSync(MESSAGE_STORE_FILE)) {
            const data = fs.readFileSync(MESSAGE_STORE_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error("Error loading message backup store:", error.message);
    }
    return {};
}

function saveStoredMessages(data) {
    try {
        fs.writeFileSync(MESSAGE_STORE_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error saving message backup store:", error.message);
    }
}
global.messageBackup = loadStoredMessages();

// --- ♻️ CLEANUP FUNCTIONS ---

function cleanupOldMessages() {
    let storedMessages = loadStoredMessages();
    let now = Math.floor(Date.now() / 1000);
    const maxMessageAge = 24 * 60 * 60;
    let cleanedMessages = {};
    for (let chatId in storedMessages) {
        let newChatMessages = {};
        for (let messageId in storedMessages[chatId]) {
            let message = storedMessages[chatId][messageId];
            if (now - message.timestamp <= maxMessageAge) {
                newChatMessages[messageId] = message; 
            }
        }
        if (Object.keys(newChatMessages).length > 0) {
            cleanedMessages[chatId] = newChatMessages; 
        }
    }
    saveStoredMessages(cleanedMessages);
    console.log("🧹 [Msg Cleanup] Old messages removed from message_backup.json");
}

function cleanupJunkFiles(botSocket) {
    let directoryPath = path.join(); 
    fs.readdir(directoryPath, async function (err, files) {
        if (err) return console.error('[Junk Cleanup] Error reading directory:', err);
        const filteredArray = files.filter(item =>
            item.endsWith(".gif") || item.endsWith(".png") || item.endsWith(".mp3") ||
            item.endsWith(".mp4") || item.endsWith(".opus") || item.endsWith(".jpg") ||
            item.endsWith(".webp") || item.endsWith(".webm") || item.endsWith(".zip")
        );
        if (filteredArray.length > 0) {
            let teks = `Detected ${filteredArray.length} junk files,\nJunk files have been deleted🚮`;
            if (botSocket && botSocket.user && botSocket.user.id) {
                botSocket.sendMessage(botSocket.user.id.split(':')[0] + '@s.whatsapp.net', { text: teks });
            }
            filteredArray.forEach(function (file) {
                const filePath = path.join(directoryPath, file);
                try {
                    if(fs.existsSync(filePath)) fs.unlinkSync(filePath);
                } catch(e) {
                    console.error(`[Junk Cleanup] Failed to delete file ${file}:`, e.message);
                }
            });
            console.log(`[Junk Cleanup] ${filteredArray.length} files deleted.`);
        }
    });
}

// --- JUNE MD ORIGINAL CODE START ---
global.botname = "JUNE MD"
global.themeemoji = "•"
const pairingCode = !!global.phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

// --- Readline setup (JUNE MD) ---
const rl = process.stdin.isTTY ? readline.createInterface({ input: process.stdin, output: process.stdout }) : null
const question = (text) => rl ? new Promise(resolve => rl.question(text, resolve)) : Promise.resolve(settings.ownerNumber || global.phoneNumber)

// --- Paths (JUNE MD) ---
const sessionDir = path.join(__dirname, 'session')
const credsPath = path.join(sessionDir, 'creds.json')
const loginFile = path.join(sessionDir, 'login.json')

// --- Login persistence (JUNE MD) ---
async function saveLoginMethod(method) {
    await fs.promises.mkdir(sessionDir, { recursive: true });
    await fs.promises.writeFile(loginFile, JSON.stringify({ method }, null, 2));
}

async function getLastLoginMethod() {
    if (fs.existsSync(loginFile)) {
        const data = JSON.parse(fs.readFileSync(loginFile, 'utf-8'));
        return data.method;
    }
    return null;
}

// --- Session check (JUNE MD) ---
function sessionExists() {
    return fs.existsSync(credsPath);
}

// --- Get login method (JUNE MD) (Omitted for brevity) ---
async function getLoginMethod() {
    const lastMethod = await getLastLoginMethod();
    if (lastMethod && sessionExists()) {
        console.log(chalk.yellow(`Last login method detected: ${lastMethod}. Using it automatically.`));
        return lastMethod;
    }
    
    if (!sessionExists() && fs.existsSync(loginFile)) {
        console.log(chalk.yellow(`Session files missing. Removing old login preference for clean re-login.`));
        fs.unlinkSync(loginFile);
    }

    console.log(chalk.green("Choose login method:"));
    console.log(chalk.blue("1) Enter WhatsApp Number (Pairing Code)"));
    console.log(chalk.blue("2) Paste Session ID"));

    let choice = await question("Enter option number (1 or 2): ");
    choice = choice.trim();

    if (choice === '1') {
        let phone = await question(chalk.bgBlack(chalk.greenBright(`Enter your WhatsApp number (e.g., 254798570132): `)));
        phone = phone.replace(/[^0-9]/g, '');
        const pn = require('awesome-phonenumber');
        if (!pn('+' + phone).isValid()) { console.log(chalk.red('Invalid phone number.')); return getLoginMethod(); }
        global.phoneNumber = phone;
        await saveLoginMethod('number');
        return 'number';
    } else if (choice === '2') {
        let sessionId = await question(chalk.bgBlack(chalk.greenBright(`Paste your Session ID here: `)));
        sessionId = sessionId.trim();
        if (!sessionId.includes("JUNE-MD:~")) { console.log(chalk.red("Invalid Session ID format!")); process.exit(1); }
        global.SESSION_ID = sessionId;
        await saveLoginMethod('session');
        return 'session';
    } else {
        console.log(chalk.red("Invalid option! Please choose 1 or 2."));
        return getLoginMethod();
    }
}

// --- Download session (JUNE MD) (Omitted for brevity) ---
async function downloadSessionData() {
    try {
        await fs.promises.mkdir(sessionDir, { recursive: true });
        if (!fs.existsSync(credsPath) && global.SESSION_ID) {
            const base64Data = global.SESSION_ID.split("JUNE-MD:~")[1];
            const sessionData = Buffer.from(base64Data, 'base64');
            await fs.promises.writeFile(credsPath, sessionData);
            console.log(chalk.green(`Session successfully saved.`));
        }
    } catch (err) { console.error('Error downloading session data:', err); }
}

// --- Request pairing code (JUNE MD) (Omitted for brevity) ---
async function requestPairingCode(socket) {
    try {
        console.log(chalk.yellow("Waiting 3 seconds for socket stabilization before requesting pairing code..."));
        await delay(3000); 

        let code = await socket.requestPairingCode(global.phoneNumber);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        console.log(chalk.bgGreen.black(`\nYour Pairing Code: ${code}\n`));
        console.log(chalk.bgGreen(`
Please enter this code in WhatsApp app:
1. Open WhatsApp
2. Go to Settings => Linked Devices
3. Tap "Link a Device"
4. Enter the code shown above
        `));
        return true; 
    } catch (err) { 
        console.error(chalk.red('Failed to get pairing code:'), err); 
        return false; 
    }
}

// --- Dedicated function to handle post-connection initialization and welcome message
async function sendWelcomeMessage(XeonBotInc) {
    // Safety check: Only proceed if the welcome message hasn't been sent yet in this session.
    if (global.isBotConnected) return; 
    
    // CRITICAL: Wait 10 seconds for the connection to fully stabilize
    await delay(10000); 

    try {
        if (!XeonBotInc.user || global.isBotConnected) return;

        global.isBotConnected = true;

        console.log(chalk.green(`🏂Connected to => ` + JSON.stringify(XeonBotInc.user, null, 2)))
        const pNumber = XeonBotInc.user.id.split(':')[0] + '@s.whatsapp.net';

        // Send the message
        await XeonBotInc.sendMessage(pNumber, {
            text: `
┏━━━━━✧ CONNECTED ✧
┃✧ Prefix: [.]
┃✧ Bot: 𝐉ᴜ𝐧𝐞 𝐌ᴅ
┃✧ Status: Active
┃✧ Time: ${new Date().toLocaleString()}
┗━━━━━━━━━━━━━━━━━━━`
        });
        console.log(chalk.magenta.bold('✅ Bot successfully connected to Whatsapp. Sending welcome message...'));
    } catch (e) {
        console.error("Error sending welcome message during stabilization:", e.message);
        global.isBotConnected = false;
    }
}


// --- Start bot (JUNE MD) ---
async function startXeonBotInc() {
    console.log(chalk.cyan('Connecting to WhatsApp...')); // New Log
    const { version } = await fetchLatestBaileysVersion();
    
    // Ensure session directory exists before Baileys attempts to use it
    await fs.promises.mkdir(sessionDir, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(`./session`);
    const msgRetryCounterCache = new NodeCache();

    const XeonBotInc = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false, 
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: true,
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid);
            let msg = await store.loadMessage(jid, key.id);
            return msg?.message || "";
        },
        msgRetryCounterCache
    });

    store.bind(XeonBotInc.ev);

    // --- 🚨 MESSAGE LOGGER ---
    XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
        // (Omitted message logger logic for brevity)
        for (const msg of chatUpdate.messages) {
             if (!msg.message) continue;
             let chatId = msg.key.remoteJid;
             let messageId = msg.key.id;
             if (!global.messageBackup[chatId]) { global.messageBackup[chatId] = {}; }
             let textMessage = msg.message?.conversation || msg.message?.extendedTextMessage?.text || null;
             if (!textMessage) continue;
             let savedMessage = { sender: msg.key.participant || msg.key.remoteJid, text: textMessage, timestamp: msg.messageTimestamp };
             if (!global.messageBackup[chatId][messageId]) { global.messageBackup[chatId][messageId] = savedMessage; saveStoredMessages(global.messageBackup); }
        }

        // --- JUNE MD ORIGINAL HANDLER ---
        const mek = chatUpdate.messages[0];
        if (!mek.message) return;
        mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
        if (mek.key.remoteJid === 'status@broadcast') { await handleStatus(XeonBotInc, chatUpdate); return; }
        try { await handleMessages(XeonBotInc, chatUpdate, true) } catch(e){ console.error(e) }
    });


    // --- ⚠️ CONNECTION UPDATE LISTENER (Enhanced Logic with process.exit fix)
    XeonBotInc.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (connection === 'close') {
            global.isBotConnected = false; 
            
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const permanentLogout = statusCode === DisconnectReason.loggedOut || statusCode === 401;
            
            // Log and handle permanent errors (logged out, invalid session)
            if (permanentLogout) {
                console.log(chalk.bgRed.black(`\n\n🚨 WhatsApp Disconnected! Status Code: ${statusCode} (LOGGED OUT / INVALID SESSION).`));
                
                // AUTOMATICALLY DELETE SESSION
                rmSync('./session', { recursive: true, force: true });
                if (fs.existsSync(loginFile)) fs.unlinkSync(loginFile);
                
                console.log(chalk.red('🗑️ Session and login preference cleaned. Initiating full process restart in 5 seconds...'));
                await delay(5000);
                
                // CRITICAL FIX: Use process.exit(1) to trigger a clean restart by the Pterodactyl Daemon
                process.exit(1); 
                
            } else {
                // This handles temporary errors (Stream, Connection, Timeout, etc.)
                console.log(chalk.yellow(`Connection closed due to temporary issue (Status: ${statusCode}). Attempting reconnect...`));
                // Re-start the whole bot process (this handles temporary errors/reconnects)
                startXeonBotInc(); 
            }
        } else if (connection === 'open') {
            console.log(chalk.green(' '));
            console.log(chalk.blue('June md connected'));      
            console.log(chalk.magenta(`GITHUB: Vinpink2`));
            
            // Send the welcome message (which includes the 10s stability delay)
            await sendWelcomeMessage(XeonBotInc);
        }
    });

    XeonBotInc.ev.on('creds.update', saveCreds);
    XeonBotInc.public = true;
    XeonBotInc.serializeM = (m) => smsg(XeonBotInc, m, store);

    // --- ⚙️ BACKGROUND INTERVALS (Cleanup Logic) ---

    // 1. Session File Cleanup 
    setInterval(() => {
        try {
            const sessionPath = path.join(sessionDir);  
            if (!fs.existsSync(sessionPath)) return;
            fs.readdir(sessionPath, (err, files) => {
                if (err) return console.error("[Session Cleanup] Unable to scan directory:", err);
                const now = Date.now();
                const filteredArray = files.filter((item) => {
                    const filePath = path.join(sessionPath, item);
                    try {
                        const stats = fs.statSync(filePath);
                        return ((item.startsWith("pre-key") || item.startsWith("sender-key") || item.startsWith("session-") || item.startsWith("app-state")) &&
                            item !== 'creds.json' && now - stats.mtimeMs > 2 * 24 * 60 * 60 * 1000);  
                    } catch (statError) {
                            console.error(`[Session Cleanup] Error statting file ${item}:`, statError.message);
                            return false;
                    }
                });
                if (filteredArray.length > 0) {
                    console.log(`[Session Cleanup] Found ${filteredArray.length} old session files. Clearing...`);
                    filteredArray.forEach((file) => {
                        const filePath = path.join(sessionPath, file);
                        try { fs.unlinkSync(filePath); } catch (unlinkError) { console.error(`[Session Cleanup] Failed to delete file ${filePath}:`, unlinkError.message); }
                    });
                }
            });
        } catch (error) {
            console.error('[Session Cleanup] Error clearing old session files:', error);
        }
    }, 7200000); 


    // 2. Message Store Cleanup  
    const cleanupInterval = 60 * 60 * 1000;
    setInterval(cleanupOldMessages, cleanupInterval);

    // 3. Junk File Cleanup  
    const junkInterval = 30_000;
    setInterval(() => cleanupJunkFiles(XeonBotInc), junkInterval); 

    return XeonBotInc;
}

// --- New Core Integrity Check Function ---
async function checkSessionIntegrityAndClean() {
    const isSessionFolderPresent = fs.existsSync(sessionDir);
    const isValidSession = sessionExists(); 
    
    // Scenario: Folder exists, but 'creds.json' is missing (incomplete/junk session)
    if (isSessionFolderPresent && !isValidSession) {
        
        console.log(chalk.red('⚠️ Detected incomplete/junk session files on startup. Cleaning up before proceeding...'));
        
        // 1. Delete the entire session folder (junk files, partial state, etc.)
        rmSync(sessionDir, { recursive: true, force: true });
        
        // 2. Delete the login preference file if it exists, forcing re-prompt
        if (fs.existsSync(loginFile)) {
             fs.unlinkSync(loginFile);
        }
        
        // 3. Add the requested 3-second delay after cleanup
        console.log(chalk.yellow('Cleanup complete. Waiting 3 seconds for stability...'));
        await delay(3000);
    }
}


// --- Main login flow (JUNE MD) ---
async function tylor() {
    
    // 1. Run the mandatory integrity check and cleanup first
    await checkSessionIntegrityAndClean();
    
    // 2. Check for a valid session after cleanup
    if (sessionExists()) {
        console.log(chalk.green("Found valid session starting bot...")); // New Log
        console.log(chalk.yellow('Waiting 3 seconds for stable connection...')); // New Log
        await delay(3000);
        await startXeonBotInc();
        return;
    }
    
    // 3. New Login Flow (If no valid session exists)
    const loginMethod = await getLoginMethod();
    let pairingSuccess = false;
    let XeonBotInc;

    if (loginMethod === 'session') {
        await downloadSessionData();
        // Socket is only created AFTER session data is saved
        XeonBotInc = await startXeonBotInc(); 
    } else if (loginMethod === 'number') {
        // Socket is created BEFORE pairing code is requested
        XeonBotInc = await startXeonBotInc();
        pairingSuccess = await requestPairingCode(XeonBotInc); 
    } else {
        console.log(chalk.red("Failed to get valid login method. Exiting."));
        return;
    }
    
    // 4. Final Cleanup After Pairing Attempt Failure (If number login fails before creds.json is written)
    if (loginMethod === 'number' && !sessionExists() && fs.existsSync(sessionDir)) {
        console.log(chalk.red('Login interrupted/failed. Clearing temporary session files and restarting...'));
        
        rmSync(sessionDir, { recursive: true, force: true });
        if (fs.existsSync(loginFile)) fs.unlinkSync(loginFile); 
        
        // Force an exit to restart the entire login flow cleanly
        process.exit(1);
    }
}

// --- Start bot (JUNE MD) ---
tylor().catch(err => console.error('Fatal error starting bot:', err));
process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));
process.on('unhandledRejection', (err) => console.error('Unhandled Rejection:', err));
