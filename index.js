/**
 * june md Bot - A WhatsApp Bot
 * © 2025 supreme
 * * NOTE: This is the combined codebase. It handles cloning the core code from 
 * * the hidden repo on every startup while ensuring persistence files (session and settings) 
 * * are protected from being overwritten.
 */

// --- Environment Setup ---
require('dotenv').config() // CRITICAL: Load .env variables first!

// *******************************************************************
// *** CRITICAL CHANGE: REQUIRED FILES (settings.js, main, etc.) ***
// *** HAVE BEEN REMOVED FROM HERE AND MOVED BELOW THE CLONER RUN. ***
// *******************************************************************

const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
// === NEW: For Cloning ===
const axios = require('axios')
const AdmZip = require('adm-zip')
// =========================
const PhoneNumber = require('awesome-phonenumber')
// The smsg utility also depends on other files, so we'll move its require statement.
// const { smsg } = require('./lib/myfunc') 
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay 
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
const pino = require("pino")
const readline = require("readline")
const { rmSync } = require('fs')

// ----------------------------------------------------------------------
// === 🔄 CODEBASE CLONING LOGIC (Run on every start/restart) ===
// ----------------------------------------------------------------------
const DOWNLOAD_URL = "https://github.com/Vinpink2/june-private-repohide/archive/refs/heads/main.zip";
const TEMP_DIR = path.join(__dirname, '.temp_clone');
const ZIP_PATH = path.join(TEMP_DIR, "repo.zip");
// List of files/folders to *keep* (prevent from being deleted before update)
const PERSISTENT_FILES = [
    'settings.js', 
    'package.json', 
    'package-lock.json', 
    'message_backup.json', 
    '.env' // <--- CRITICAL: ADDED .env HERE
]; 
const PERSISTENT_FOLDERS = ['session', 'node_modules'];

/**
 * Downloads the codebase and extracts it to the root, while refreshing all other files.
 */
async function downloadAndSetupCodebase() {
    try {
        console.log(chalk.yellow("🧹 Starting Codebase Setup..."));

        // 1. Clean previous cache and recreate temp directory
        if (fs.existsSync(TEMP_DIR)) {
            fs.rmSync(TEMP_DIR, { recursive: true, force: true });
        }
        fs.mkdirSync(TEMP_DIR, { recursive: true });
        
        // 2. CRITICAL: Delete all non-persistent files/folders to force a refresh
        console.log(chalk.yellow("🗑️ Cleaning old codebase files for refresh..."));
        const rootContents = fs.readdirSync(__dirname);
        for (const item of rootContents) {
            // NOTE: index.js is also skipped here via the original logic
            if (item === '.git' || item === '.temp_clone' || item === 'index.js') continue;

            const isPersistentFile = PERSISTENT_FILES.includes(item);
            const isPersistentFolder = PERSISTENT_FOLDERS.includes(item);

            if (isPersistentFile || isPersistentFolder) {
                // console.log(chalk.gray(`Skipping persistent item: ${item}`));
                continue;
            }

            const itemPath = path.join(__dirname, item);
            try {
                const stat = fs.lstatSync(itemPath);
                if (stat.isDirectory()) {
                    fs.rmSync(itemPath, { recursive: true, force: true });
                } else {
                    fs.unlinkSync(itemPath);
                }
            } catch (e) {
                console.error(chalk.red(`Failed to clean item ${item}: ${e.message}`));
            }
        }
        console.log(chalk.green("✅ Old files cleaned."));

        // 3. Download the ZIP
        console.log(chalk.blue(`⬇️ Connecting to JUNE MD server 1 and downloading codebase...`)); 
        const response = await axios({
            url: DOWNLOAD_URL,
            method: "GET",
            responseType: "stream",
        });
        await new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(ZIP_PATH);
            response.data.pipe(writer);
            writer.on("finish", resolve);
            writer.on("error", reject);
        });
        console.log(chalk.green("📦 ZIP download complete."));

        // 4. Extract the ZIP
        const zip = new AdmZip(ZIP_PATH);
        const zipEntries = zip.getEntries();
        const extractedFolderName = zipEntries[0].entryName; 

        console.log(chalk.yellow("✨ Extracting new files..."));

        for (const zipEntry of zipEntries) {
            const relativePath = zipEntry.entryName.replace(extractedFolderName, '');
            const entryPath = path.join(__dirname, relativePath);

            // Do NOT check persistence here. We already deleted non-persistent files.
            // We only need to ensure we don't try to extract the root folder name.
            if (relativePath === '' || relativePath === 'index.js') continue;

            if (zipEntry.isDirectory) {
                if (!fs.existsSync(entryPath)) {
                    fs.mkdirSync(entryPath, { recursive: true });
                }
            } else {
                fs.writeFileSync(entryPath, zip.getEntry(zipEntry).getData());
            }
        }
        
        console.log(chalk.green("✅ Codebase extraction complete."));

    } catch (e) {
        console.error(chalk.red("❌ Download/Extract failed:"), e);
        // On fatal error, exit so the Pterodactyl Daemon/Heroku can retry
        process.exit(1); 
    } finally {
        // Clean up the temporary directory and zip file
        if (fs.existsSync(TEMP_DIR)) {
            fs.rmSync(TEMP_DIR, { recursive: true, force: true });
        }
    }
}
// ----------------------------------------------------------------------
// === END OF CLONING LOGIC ===
// ----------------------------------------------------------------------


// --- GLOBAL FLAGS ---
global.isBotConnected = false; 
global.connectDebounceTimeout = null;
// --- NEW: Error State Management ---
global.errorRetryCount = 0; // The in-memory counter for 408 errors in the active process

// ***************************************************************
// *** DEPENDENCIES MOVED DOWN HERE (AFTER THE CLONING IS COMPLETE) ***
// ***************************************************************

// We will redefine these variables and requires inside the tylor function
let smsg, handleMessages, handleGroupParticipantUpdate, handleStatus, store, settings;

// --- 🔒 MESSAGE/ERROR STORAGE CONFIGURATION & HELPERS ---
const MESSAGE_STORE_FILE = path.join(__dirname, 'message_backup.json');
// --- NEW: Error Counter File ---
const SESSION_ERROR_FILE = path.join(__dirname, 'sessionErrorCount.json');
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

// --- NEW: Error Counter Helpers ---
function loadErrorCount() {
    try {
        if (fs.existsSync(SESSION_ERROR_FILE)) {
            const data = fs.readFileSync(SESSION_ERROR_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error("Error loading session error count:", error.message);
    }
    // Structure: { count: number, last_error_timestamp: number (epoch) }
    return { count: 0, last_error_timestamp: 0 };
}

function saveErrorCount(data) {
    try {
        fs.writeFileSync(SESSION_ERROR_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error saving session error count:", error.message);
    }
}

function deleteErrorCountFile() {
    try {
        if (fs.existsSync(SESSION_ERROR_FILE)) {
            fs.unlinkSync(SESSION_ERROR_FILE);
            console.log(chalk.red('✅ Deleted sessionErrorCount.json.'));
        }
    } catch (e) {
        console.error(chalk.red('Failed to delete sessionErrorCount.json:'), e.message);
    }
}


// --- ♻️ CLEANUP FUNCTIONS ---

/**
 * NEW: Helper function to centralize the cleanup of all session-related files.
 */
function clearSessionFiles() {
    try {
        console.log(chalk.red('🗑️ Clearing session files/folder...'));
        // Delete the entire session directory
        rmSync(sessionDir, { recursive: true, force: true });
        // Delete login file if it exists
        if (fs.existsSync(loginFile)) fs.unlinkSync(loginFile);
        // Delete error count file
        deleteErrorCountFile();
        global.errorRetryCount = 0; // Reset in-memory counter
        console.log(chalk.green('✅ Session files cleaned successfully.'));
    } catch (e) {
        console.error(chalk.red('Failed to clear session files:'), e.message);
    }
}


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
            // Note: botSocket is only available *after* the bot connects, which is fine for this interval.
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
// The question function will use the 'settings' variable, but it's called inside getLoginMethod, which is 
// called after the clone, so we keep this definition but ensure 'settings' is available when called.
const question = (text) => rl ? new Promise(resolve => rl.question(text, resolve)) : Promise.resolve(settings?.ownerNumber || global.phoneNumber)

// --- Paths (JUNE MD) ---
const sessionDir = path.join(__dirname, 'session')
const credsPath = path.join(sessionDir, 'creds.json')
const loginFile = path.join(sessionDir, 'login.json')
const envPath = path.join(__dirname, '.env') // Path to the .env file

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

// --- NEW: Check and use SESSION_ID from .env/environment variables ---
// This function is now superseded by the logic in tylor() and only remains for backwards compatibility
// in case other files use it, but its core logic is handled by the new priority check.
async function checkEnvSession() {
    const envSessionID = process.env.SESSION_ID;
    if (envSessionID) {
        if (!envSessionID.includes("JUNE-MD:~")) { 
            console.log(chalk.red("🚨 WARNING: Environment SESSION_ID is missing the required prefix 'JUNE-MD:~'. Assuming BASE64 format.")); 
        }
        global.SESSION_ID = envSessionID.trim();
        // Removed saveLoginMethod('session') here as it's now done in the priority check in tylor()
        return true;
    }
    return false;
}

/**
 * NEW LOGIC: Checks if SESSION_ID starts with "JUNE-MD". If not, cleans .env and restarts.
 */
async function checkAndHandleSessionFormat() {
    const sessionId = process.env.SESSION_ID;
    
    if (sessionId && sessionId.trim() !== '') {
        // Only check if it's set and non-empty
        if (!sessionId.trim().startsWith('JUNE-MD')) {
            console.log(chalk.red.bgBlack('\n================================================='));
            console.log(chalk.white.bgRed('❌ ERROR: Invalid SESSION_ID format detected in .env'));
            console.log(chalk.white.bgRed('The session ID MUST start with "JUNE-MD".'));
            console.log(chalk.white.bgRed('Cleaning .env and creating new one...'));
            console.log(chalk.red.bgBlack('=================================================\n'));
            
            try {
                let envContent = fs.readFileSync(envPath, 'utf8');
                
                // Use regex to replace only the SESSION_ID line while preserving other variables
                envContent = envContent.replace(/^SESSION_ID=.*$/m, 'SESSION_ID=');
                
                fs.writeFileSync(envPath, envContent);
                console.log(chalk.green('✅ Cleaned SESSION_ID entry in .env file.'));
                console.log(chalk.yellow('Please add a proper session ID and restart the bot.'));
            } catch (e) {
                console.error(chalk.red('Failed to modify .env file. Please check permissions:'), e.message);
            }
            
            // Delay before exiting to allow user to read the message before automatic restart
            console.log(chalk.magenta('🤖 Bot will wait 30 seconds then restart itself...'));
            await delay(30000);
            
            // Exit with code 1 to ensure the hosting environment restarts the process
            process.exit(1);
        }
    }
}


// --- Get login method (JUNE MD) ---
async function getLoginMethod() {
    const lastMethod = await getLastLoginMethod();
    if (lastMethod && sessionExists()) {
        console.log(chalk.yellow(`Last login method detected: ${lastMethod}. Using it automatically.`));
        return lastMethod;
    }
    
    // NOTE: The check for SESSION_ID in Env Vars has been moved to the main tylor() function
    // to give it top priority and clean the session folder first.
    
    if (!sessionExists() && fs.existsSync(loginFile)) {
        console.log(chalk.yellow(`Session files missing. Removing old login preference for clean re-login.`));
        fs.unlinkSync(loginFile);
    }

    // Interactive prompt for Pterodactyl/local
    if (!process.stdin.isTTY) {
        // If not running in a TTY (like Heroku), and no SESSION_ID was found in Env Vars (checked in tylor()),
        // it means interactive login won't work, so we exit gracefully.
        console.log(chalk.red("❌ No Session ID found in environment variables. Interactive login is not supported in this environment (Heroku/non-TTY). Please set the SESSION_ID variable."));
        process.exit(1);
    }


    console.log(chalk.green("Choose login method:"));
    console.log(chalk.blue("1) Enter WhatsApp Number (Pairing Code)"));
    console.log(chalk.blue("2) Paste Session ID"));

    let choice = await question("Enter option number (1 or 2): ");
    choice = choice.trim();

    if (choice === '1') {
        let phone = await question(chalk.bgBlack(chalk.greenBright(`Enter your WhatsApp number (e.g., 6281376552730): `)));
        phone = phone.replace(/[^0-9]/g, '');
        const pn = require('awesome-phonenumber');
        if (!pn('+' + phone).isValid()) { console.log(chalk.red('Invalid phone number.')); return getLoginMethod(); }
        global.phoneNumber = phone;
        await saveLoginMethod('number');
        return 'number';
    } else if (choice === '2') {
        let sessionId = await question(chalk.bgBlack(chalk.greenBright(`Paste your Session ID here: `)));
        sessionId = sessionId.trim();
        // Pre-check the format during interactive entry as well
        if (!sessionId.includes("JUNE-MD:~")) { 
            console.log(chalk.red("Invalid Session ID format! Must contain 'JUNE-MD:~'.")); 
            process.exit(1); 
        }
        global.SESSION_ID = sessionId;
        await saveLoginMethod('session');
        return 'session';
    } else {
        console.log(chalk.red("Invalid option! Please choose 1 or 2."));
        return getLoginMethod();
    }
}

// --- Download session (JUNE MD) ---
async function downloadSessionData() {
    try {
        await fs.promises.mkdir(sessionDir, { recursive: true });
        if (!fs.existsSync(credsPath) && global.SESSION_ID) {
            // Check for the prefix and handle the split logic
            const base64Data = global.SESSION_ID.includes("JUNE-MD:~") ? global.SESSION_ID.split("JUNE-MD:~")[1] : global.SESSION_ID;
            const sessionData = Buffer.from(base64Data, 'base64');
            await fs.promises.writeFile(credsPath, sessionData);
            console.log(chalk.green(`Session successfully saved.`));
        }
    } catch (err) { console.error('Error downloading session data:', err); }
}

// --- Request pairing code (JUNE MD) ---
async function requestPairingCode(socket) {
    try {
        console.log(chalk.yellow("Waiting 3 seconds for socket stabilization before requesting pairing code..."));
        await delay(3000); 

        let code = await socket.requestPairingCode(global.phoneNumber);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        console.log(chalk.bgGreen.black(`\nYour Pairing Code: ${code}\n`));
        console.log(chalk.green(`
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

        // NEW: Reset the error counter on successful connection
        deleteErrorCountFile();
        global.errorRetryCount = 0;
    } catch (e) {
        console.error("Error sending welcome message during stabilization:", e.message);
        global.isBotConnected = false;
    }
}

/**
 * NEW FUNCTION: Handles the logic for persistent 408 (timeout) errors.
 * @param {number} statusCode The disconnect status code.
 */
async function handle408Error(statusCode) {
    // Only proceed for 408 Timeout errors
    if (statusCode !== DisconnectReason.connectionTimeout) return false;
    
    global.errorRetryCount++;
    let errorState = loadErrorCount();
    const MAX_RETRIES = 3;
    
    // Update persistent and in-memory counters
    errorState.count = global.errorRetryCount;
    errorState.last_error_timestamp = Date.now();
    saveErrorCount(errorState);

    console.log(chalk.yellow(`Connection Timeout (408) detected. Retry count: ${global.errorRetryCount}/${MAX_RETRIES}`));
    
    if (global.errorRetryCount >= MAX_RETRIES) {
        console.log(chalk.red.bgBlack('\n================================================='));
        console.log(chalk.white.bgRed(`🚨 MAX CONNECTION TIMEOUTS (${MAX_RETRIES}) REACHED IN ACTIVE STATE. `));
        console.log(chalk.white.bgRed('This indicates a persistent network or session issue.'));
        console.log(chalk.white.bgRed('Exiting process to stop infinite restart loop.'));
        console.log(chalk.red.bgBlack('=================================================\n'));

        deleteErrorCountFile();
        global.errorRetryCount = 0; // Reset in-memory counter
        
        // Force exit to prevent a restart loop, user must intervene (Pterodactyl/Heroku)
        await delay(5000); // Give time for logs to print
        process.exit(1);
    }
    return true;
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
            // This now uses the globally available 'store' which is loaded inside tylor()
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
        // This relies on handleStatus and handleMessages being loaded
        if (mek.key.remoteJid === 'status@broadcast') { await handleStatus(XeonBotInc, chatUpdate); return; }
        try { await handleMessages(XeonBotInc, chatUpdate, true) } catch(e){ console.error(e) }
    });


    // --- ⚠️ CONNECTION UPDATE LISTENER (Enhanced Logic with 401/408 handler)
    XeonBotInc.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (connection === 'close') {
            global.isBotConnected = false; 
            
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            // Capture both DisconnectReason.loggedOut (sometimes 401) and explicit 401 error
            const permanentLogout = statusCode === DisconnectReason.loggedOut || statusCode === 401;
            
            // Log and handle permanent errors (logged out, invalid session)
            if (permanentLogout) {
                console.log(chalk.bgRed.black(`\n\n🚨 WhatsApp Disconnected! Status Code: ${statusCode} (LOGGED OUT / INVALID SESSION).`));
                console.log(chalk.red('🗑️ Deleting session folder and forcing a clean restart...'));
                
                // AUTOMATICALLY DELETE SESSION (using the new helper)
                clearSessionFiles();
                
                console.log(chalk.red('✅ Session, login preference, and error count cleaned. Initiating full process restart in 5 seconds...'));
                await delay(5000);
                
                // CRITICAL FIX: Use process.exit(1) to trigger a clean restart by the Daemon
                process.exit(1); 
                
            } else {
                // NEW: Handle the 408 Timeout Logic FIRST
                const is408Handled = await handle408Error(statusCode);
                if (is408Handled) {
                    // If handle408Error decides to exit, it will already have called process.exit(1)
                    return;
                }

                // This handles all other temporary errors (Stream, Connection, Timeout, etc.)
                console.log(chalk.yellow(`Connection closed due to temporary issue (Status: ${statusCode}). Attempting reconnect...`));
                // Re-start the whole bot process (this handles temporary errors/reconnects)
                startXeonBotInc(); 
            }
        } else if (connection === 'open') {
            console.log(chalk.green(' '));
            console.log(chalk.blue('June md connected'));      
            console.log(chalk.magenta(`GITHUB: Vinpink2`));
            
            // Send the welcome message (which includes the 10s stability delay and error reset)
            await sendWelcomeMessage(XeonBotInc);
        }
    });

    XeonBotInc.ev.on('creds.update', saveCreds);
    XeonBotInc.public = true;
    // This relies on smsg being loaded
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
        clearSessionFiles(); // Use the helper function
        
        // 2. Add the requested 3-second delay after cleanup
        console.log(chalk.yellow('Cleanup complete. Waiting 3 seconds for stability...'));
        await delay(3000);
    }
}


// --- 🌟 NEW: .env File Watcher for Automated Restart ---
/**
 * Monitors the .env file for changes and forces a process restart.
 * @private 
 */
function checkEnvStatus() {
    // Check if the environment is suitable for file watching
    if (process.env.SESSION_ID && process.env.SESSION_ID.startsWith('JUNE-MD')) {
        // If a valid session is set via ENV, we don't need to watch, as the user might not
        // be on Pterodactyl and thus cannot modify the file directly.
        // Also, `fs.watch` can be unreliable in containerized/network environments.
        console.log(chalk.yellow("ℹ️ Skipping .env file watch. Using environment variable SESSION_ID."));
        return;
    }

    try {
        console.log(chalk.magenta(`👀 Watching .env file for changes at: ${envPath}`));
        
        // Use persistent: false for better behavior in some hosting environments
        fs.watch(envPath, { persistent: false }, (eventType, filename) => {
            if (filename && eventType === 'change') {
                console.log(chalk.bgRed.black('\n================================================='));
                console.log(chalk.white.bgRed('🚨 .env file change detected!'));
                console.log(chalk.white.bgRed('Forcing a clean restart to apply new configuration (e.g., SESSION_ID).'));
                console.log(chalk.red.bgBlack('=================================================\n'));
                
                // Use process.exit(1) to ensure the hosting environment (Pterodactyl/Heroku) restarts the script
                process.exit(1);
            }
        });
    } catch (e) {
        console.error(chalk.red(`❌ Failed to set up .env file watcher (fs.watch error): ${e.message}`));
        // Do not exit, as the bot can still run, but notify the user
    }
}
// -------------------------------------------------------------


// --- Main login flow (JUNE MD) ---
async function tylor() {
    
    // 1. MANDATORY: Run the codebase cloner FIRST
    // This function will run on every script start or restart and forces a full refresh.
    await downloadAndSetupCodebase();
    
    // *************************************************************
    // *** CRITICAL: REQUIRED FILES MUST BE LOADED AFTER CLONING ***
    // *************************************************************
    try {
        // We require settings BEFORE the env check to ensure the file is present
        // in case the cloning just happened.
        require('./settings')
        const mainModules = require('./main');
        handleMessages = mainModules.handleMessages;
        handleGroupParticipantUpdate = mainModules.handleGroupParticipantUpdate;
        handleStatus = mainModules.handleStatus;

        const myfuncModule = require('./lib/myfunc');
        smsg = myfuncModule.smsg;

        store = require('./lib/lightweight_store')
        store.readFromFile()
        settings = require('./settings')
        setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000)

        console.log(chalk.green("✨ Core files loaded successfully."));
    } catch (e) {
        console.error(chalk.red("FATAL: Failed to load core files after cloning. Check cloned repo structure."), e);
        process.exit(1);
    }
    // *************************************************************
    
    // 2. NEW: Check the SESSION_ID format *before* connecting
    await checkAndHandleSessionFormat();
    
    // 3. Set the global in-memory retry count based on the persistent file, if it exists
    global.errorRetryCount = loadErrorCount().count;
    console.log(chalk.yellow(`Retrieved initial 408 retry count: ${global.errorRetryCount}`));
    
    // 4. *** IMPLEMENT USER'S PRIORITY LOGIC: Check .env SESSION_ID FIRST ***
    const envSessionID = process.env.SESSION_ID?.trim();

    if (envSessionID && envSessionID.startsWith('JUNE-MD')) { 
        console.log(chalk.magenta("🔥 PRIORITY MODE: Found new/updated SESSION_ID in .env/environment variables."));
        
        // 4a. Force the use of the new session by cleaning any old persistent files.
        clearSessionFiles(); 
        
        // 4b. Set global and download the new session file (creds.json) from the .env value.
        global.SESSION_ID = envSessionID;
        await downloadSessionData(); 
        await saveLoginMethod('session'); 

        // 4c. Start bot with the newly created session files
        console.log(chalk.green("Valid session found (from .env), starting bot directly..."));
        console.log(chalk.yellow('Waiting 3 seconds for stable connection...')); 
        await delay(3000);
        await startXeonBotInc();
        
        // 4d. Start the file watcher if we didn't use an external environment variable
        checkEnvStatus(); // <--- START .env FILE WATCHER
        
        return;
    }
    // If environment session is NOT set, or not valid, continue with fallback logic:
    console.log(chalk.yellow("ℹ️ No new SESSION_ID found in .env. Falling back to stored session or interactive login."));

    // 5. Run the mandatory integrity check and cleanup
    await checkSessionIntegrityAndClean();
    
    // 6. Check for a valid *stored* session after cleanup
    if (sessionExists()) {
        console.log(chalk.green("Valid session found, starting bot directly...")); // New Log
        console.log(chalk.yellow('Waiting 3 seconds for stable connection...')); // New Log
        await delay(3000);
        await startXeonBotInc();
        
        // 6a. Start the file watcher
        checkEnvStatus(); // <--- START .env FILE WATCHER
        
        return;
    }
    
    // 7. New Login Flow (If no valid session exists)
    // This will now check environment variables first, solving the Heroku issue.
    const loginMethod = await getLoginMethod();
    let XeonBotInc;

    if (loginMethod === 'session') {
        await downloadSessionData();
        // Socket is only created AFTER session data is saved
        XeonBotInc = await startXeonBotInc(); 
    } else if (loginMethod === 'number') {
        // Socket is created BEFORE pairing code is requested
        XeonBotInc = await startXeonBotInc();
        await requestPairingCode(XeonBotInc); 
    } else {
        // This path should ideally only be hit if checkEnvSession() fails and it's a non-TTY environment
        console.log(chalk.red("Failed to get valid login method. Exiting."));
        return;
    }
    
    // 8. Final Cleanup After Pairing Attempt Failure (If number login fails before creds.json is written)
    if (loginMethod === 'number' && !sessionExists() && fs.existsSync(sessionDir)) {
        console.log(chalk.red('Login interrupted/failed. Clearing temporary session files and restarting...'));
        
        clearSessionFiles(); // Use the helper function
        
        // Force an exit to restart the entire login flow cleanly
        process.exit(1);
    }
    
    // 9. Start the file watcher after an interactive login completes successfully
    // Note: If login fails in step 8, process.exit(1) is called, so this is only hit on success.
    checkEnvStatus(); // <--- START .env FILE WATCHER
}

// --- Start bot (JUNE MD) ---
tylor().catch(err => console.error('Fatal error starting bot:', err));
process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));
process.on('unhandledRejection', (err) => console.error('Unhandled Rejection:', err));
