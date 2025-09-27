/**
 * june md Bot - A WhatsApp Bot
 * © 2025 supreme
 */

require('./settings')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main');
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./lib/myfunc')
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    jidDecode,
    proto,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
const pino = require("pino")
const readline = require("readline")
const { rmSync } = require('fs')

// Lightweight store
const store = require('./lib/lightweight_store')
store.readFromFile()
const settings = require('./settings')
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000)

// Memory optimization
setInterval(() => {
    if (global.gc) {
        global.gc()
        console.log('🧹 Garbage collection completed')
    }
}, 60_000)

// RAM monitoring
setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024
    if (used > 400) {
        console.log('⚠️ RAM too high (>400MB), restarting bot...')
        process.exit(1)
    }
}, 30_000)

global.botname = "JUNE MD"
global.themeemoji = "•"
const pairingCode = !!global.phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

// Readline setup
const rl = process.stdin.isTTY ? readline.createInterface({ input: process.stdin, output: process.stdout }) : null
const question = (text) => {
    if (rl) return new Promise(resolve => rl.question(text, resolve))
    else return Promise.resolve(settings.ownerNumber || global.phoneNumber)
}

const sessionDir = path.join(__dirname, 'session')
const credsPath = path.join(sessionDir, 'creds.json')

// --- Login selection ---
async function getLoginMethod() {
    console.log(chalk.green("Choose login method:"));
    console.log(chalk.blue("1) Enter WhatsApp Number"));
    console.log(chalk.blue("2) Paste Session ID"));

    let choice = await question("Enter option number (1 or 2): ");
    choice = choice.trim();

    if (choice === '1') {
        let phone = await question(chalk.bgBlack(chalk.greenBright(`Enter your WhatsApp number (e.g., 6281376552730): `)));
        phone = phone.replace(/[^0-9]/g, '');

        const pn = require('awesome-phonenumber');
        if (!pn('+' + phone).isValid()) {
            console.log(chalk.red('Invalid phone number.'));
            process.exit(1);
        }
        global.phoneNumber = phone;
        return 'number';
    } else if (choice === '2') {
        let sessionId = await question(chalk.bgBlack(chalk.greenBright(`Paste your Session ID here: `)));
        sessionId = sessionId.trim();

        if (!sessionId.includes("trashcore~")) {
            console.log(chalk.red("Invalid Session ID format!"));
            process.exit(1);
        }
        global.SESSION_ID = sessionId;
        return 'session';
    } else {
        console.log(chalk.red("Invalid option! Please choose 1 or 2."));
        return getLoginMethod();
    }
}

// --- Download session from pasted ID ---
async function downloadSessionData() {
    try {
        await fs.promises.mkdir(sessionDir, { recursive: true });
        if (!fs.existsSync(credsPath)) {
            if (!global.SESSION_ID) {
                console.log(chalk.red(`No session ID found and creds.json missing.`));
                return;
            }
            const base64Data = global.SESSION_ID.split("trashcore~")[1];
            const sessionData = Buffer.from(base64Data, 'base64');
            await fs.promises.writeFile(credsPath, sessionData);
            console.log(chalk.green(`Session successfully saved.`));
        }
    } catch (err) {
        console.error('Error downloading session data:', err);
    }
}

// --- Request pairing code for number login ---
async function requestPairingCode(socket) {
    try {
        let code = await socket.requestPairingCode(global.phoneNumber);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        console.log(chalk.bgGreen.black(`\nYour Pairing Code: ${code}\n`));
        console.log(chalk.yellow(`
Please enter this code in WhatsApp app:
1. Open WhatsApp
2. Go to Settings > Linked Devices
3. Tap "Link a Device"
4. Enter the code shown above
        `));
    } catch (err) {
        console.error(chalk.red('Failed to get pairing code:'), err);
    }
}

// --- Start bot function ---
async function startXeonBotInc() {
    let { version } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState(`./session`)
    const msgRetryCounterCache = new NodeCache()

    const XeonBotInc = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: true,
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid)
            let msg = await store.loadMessage(jid, key.id)
            return msg?.message || ""
        },
        msgRetryCounterCache
    })

    store.bind(XeonBotInc.ev)

    // Event listeners
    XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
        const mek = chatUpdate.messages[0]
        if (!mek.message) return
        mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
        if (mek.key.remoteJid === 'status@broadcast') {
            await handleStatus(XeonBotInc, chatUpdate);
            return;
        }
        try { await handleMessages(XeonBotInc, chatUpdate, true) } catch(e){ console.error(e) }
    })

    XeonBotInc.ev.on('connection.update', async (s) => {
        const { connection, lastDisconnect } = s
        if (connection === 'open') console.log(chalk.blue.bold('Bot connected ✔︎'))
        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode
            if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
                rmSync('./session', { recursive: true, force: true })
            }
            startXeonBotInc()
        }
    })

    XeonBotInc.ev.on('creds.update', saveCreds)
    XeonBotInc.public = true
    XeonBotInc.serializeM = (m) => smsg(XeonBotInc, m, store)

    return XeonBotInc
}

// --- Main login flow ---
async function tylor() {
    const loginMethod = await getLoginMethod();

    if (loginMethod === 'session') {
        await downloadSessionData();
        await startXeonBotInc();
    } else if (loginMethod === 'number') {
        const XeonBotInc = await startXeonBotInc();
        await requestPairingCode(XeonBotInc);
    }
}

// Start bot with error handling
tylor().catch(err => console.error('Fatal error starting bot:', err))
process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err))
process.on('unhandledRejection', (err) => console.error('Unhandled Rejection:', err))
