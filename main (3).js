/*━━━━━━━━━━━━━━━━━━━━*/
// -----Core imports first-----
/*━━━━━━━━━━━━━━━━━━━━*/
const settings = require('./settings');
require('./config.js');
const { isBanned } = require('./lib/isBanned');
const yts = require('yt-search');
const { fetchBuffer } = require('./lib/myfunc');
const fs = require('fs');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const path = require('path');
const chalk = require('chalk');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { jidDecode } = require('@whiskeysockets/baileys');
const { isSudo } = require('./lib/index');
const isAdmin = require('./lib/isAdmin');
const { Antilink } = require('./lib/antilink');
const { tictactoeCommand, handleTicTacToeMove } = require('./commands/tictactoe');

/*━━━━━━━━━━━━━━━━━━━━*/
// -----Command imports - Handlers-----
/*━━━━━━━━━━━━━━━━━━━━*/
const { 
   autotypingCommand,
   isAutotypingEnabled,
   handleAutotypingForMessage,
   handleAutotypingForCommand, 
   showTypingAfterCommand
} = require('./commands/autotyping');

const {
  getPrefix, 
  handleSetPrefixCommand 
} = require('./commands/setprefix');
 
const {
 autoreadCommand,
 isAutoreadEnabled, 
 handleAutoread 
} = require('./commands/autoread');
 
const { 
 incrementMessageCount, 
 topMembers 
} = require('./commands/topmembers');
 
const { 
 setGroupDescription, 
 setGroupName, 
 setGroupPhoto 
} = require('./commands/groupmanage');
 
const { 
 handleAntilinkCommand, 
 handleLinkDetection 
} = require('./commands/antilink');

const { 
 handleAntitagCommand, 
 handleTagDetection
} = require('./commands/antitag');
 
const { 
 handleMentionDetection,
 mentionToggleCommand,
 setMentionCommand
} = require('./commands/mention');
 
const { 
 handleAntiBadwordCommand,
 handleBadwordDetection
} = require('./lib/antibadword');

const { 
 handleChatbotCommand,
 handleChatbotResponse
} = require('./commands/chatbot');
  
const { 
  welcomeCommand,
  handleJoinEvent
} = require('./commands/welcome');
   
const {
 goodbyeCommand,
 handleLeaveEvent
} = require('./commands/goodbye');
  
const {
 handleAntideleteCommand,
 handleMessageRevocation,
 storeMessage 
} = require('./commands/antidelete');
 
const {
 anticallCommand,
 readState: readAnticallState 
} = require('./commands/anticall');
 
const {
 pmblockerCommand, 
 readState: readPmBlockerState 
} = require('./commands/pmblocker');
 
const {
 addCommandReaction, 
 handleAreactCommand 
} = require('./lib/reactions');
  
const {
  autoStatusCommand, 
  handleStatusUpdate 
} = require('./commands/autostatus');
  
const {
 startHangman, 
 guessLetter 
} = require('./commands/hangman');
 
const {
 startTrivia, 
 answerTrivia 
} = require('./commands/trivia');

const {
 miscCommand, 
 handleHeart 
} = require('./commands/misc');
 
/*━━━━━━━━━━━━━━━━━━━━*/
// -----Command imports-----
/*━━━━━━━━━━━━━━━━━━━━*/
const getppCommand = require('./commands/getpp');
const tagAllCommand = require('./commands/tagall');
const helpCommand = require('./commands/help');
const banCommand = require('./commands/ban');
const { promoteCommand } = require('./commands/promote');
const { demoteCommand } = require('./commands/demote');
const muteCommand = require('./commands/mute');
const unmuteCommand = require('./commands/unmute');
const stickerCommand = require('./commands/sticker');
const warnCommand = require('./commands/warn');
const warningsCommand = require('./commands/warnings');
const ttsCommand = require('./commands/tts');
const ownerCommand = require('./commands/owner');
const deleteCommand = require('./commands/delete');
const memeCommand = require('./commands/meme');
const tagCommand = require('./commands/tag');
const tagNotAdminCommand = require('./commands/tagnotadmin');
const hideTagCommand = require('./commands/hidetag');
const jokeCommand = require('./commands/joke');
const quoteCommand = require('./commands/quote');
const factCommand = require('./commands/fact');
const weatherCommand = require('./commands/weather');
const newsCommand = require('./commands/news');
const kickCommand = require('./commands/kick');
const simageCommand = require('./commands/simage');
const attpCommand = require('./commands/attp');
const { complimentCommand } = require('./commands/compliment');
const { insultCommand } = require('./commands/insult');
const { eightBallCommand } = require('./commands/eightball');
const { lyricsCommand } = require('./commands/lyrics');
const { dareCommand } = require('./commands/dare');
const { truthCommand } = require('./commands/truth');
const { clearCommand } = require('./commands/clear');
const pingCommand = require('./commands/ping');
const aliveCommand = require('./commands/alive');
const blurCommand = require('./commands/img-blur');
const githubCommand = require('./commands/github');
const antibadwordCommand = require('./commands/antibadword');
const takeCommand = require('./commands/take');
const { flirtCommand } = require('./commands/flirt');
const characterCommand = require('./commands/character');
const wastedCommand = require('./commands/wasted');
const shipCommand = require('./commands/ship');
const groupInfoCommand = require('./commands/groupinfo');
const resetlinkCommand = require('./commands/resetlink');
const staffCommand = require('./commands/staff');
const unbanCommand = require('./commands/unban');
const emojimixCommand = require('./commands/emojimix');
const { handlePromotionEvent } = require('./commands/promote');
const { handleDemotionEvent } = require('./commands/demote');
const viewOnceCommand = require('./commands/viewonce');
const clearSessionCommand = require('./commands/clearsession');
const { simpCommand } = require('./commands/simp');
const { stupidCommand } = require('./commands/stupid');
const stickerTelegramCommand = require('./commands/stickertelegram');
const textmakerCommand = require('./commands/textmaker');
const clearTmpCommand = require('./commands/cleartmp');
const setProfilePicture = require('./commands/setpp');
const instagramCommand = require('./commands/instagram');
const facebookCommand = require('./commands/facebook');
const spotifyCommand = require('./commands/spotify');
const playCommand = require('./commands/play');
const tiktokCommand = require('./commands/tiktok');
const songCommand = require('./commands/song');
const aiCommand = require('./commands/ai');
const urlCommand = require('./commands/url');
const { handleTranslateCommand } = require('./commands/translate');
const { handleSsCommand } = require('./commands/ss');
const { goodnightCommand } = require('./commands/goodnight');
const { shayariCommand } = require('./commands/shayari');
const { rosedayCommand } = require('./commands/roseday');
const imagineCommand = require('./commands/imagine');
const videoCommand = require('./commands/video');
const sudoCommand = require('./commands/sudo');
const { animeCommand } = require('./commands/anime');
const { piesCommand, piesAlias } = require('./commands/pies');
const stickercropCommand = require('./commands/stickercrop');
const updateCommand = require('./commands/update');
const removebgCommand = require('./commands/removebg');
const { reminiCommand } = require('./commands/remini');
const { igsCommand } = require('./commands/igs');
const settingsCommand = require('./commands/settings');
const soraCommand = require('./commands/sora');
const apkCommand = require('./commands/apk');
const menuConfigCommand = require('./commands/menuConfig');

/*━━━━━━━━━━━━━━━━━━━━*/
// Global settings
/*━━━━━━━━━━━━━━━━━━━━*/
global.packname = settings?.packname || "JUNE MD";
global.author = settings?.author || "Vinpink2";
global.channelLink = "https://whatsapp.com/channel/0029Va90zAnIHphOuO8Msp3A";
global.ytch = "Mr Unique Hacker";

// Channel info for message context
const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363417542294659@newsletter',
            newsletterName: 'cypherX space',
            serverMessageId: -1
        }
    }
};

/*━━━━━━━━━━━━━━━━━━━━*/
// Main Message Handler
/*━━━━━━━━━━━━━━━━━━━━*/
async function handleMessages(sock, messageUpdate, printLog) {
    try {
        const { messages, type } = messageUpdate;
        if (type !== 'notify') return;

        const message = messages[0];
        if (!message?.message) return;

        // Handle autoread functionality
        await handleAutoread(sock, message);

        // Store message for antidelete feature
        if (message.message) {
            storeMessage(sock, message);
        }

        // Handle message revocation
        if (message.message?.protocolMessage?.type === 0) {
            await handleMessageRevocation(sock, message);
            return;
        }

        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
            
        /*━━━━━━━━━━━━━━━━━━━━*/
        // Dynamic prefix      
        /*━━━━━━━━━━━━━━━━━━━━*/
        const prefix = getPrefix();
        
        const isGroup = chatId.endsWith('@g.us');
        const senderIsSudo = await isSudo(senderId);

        const userMessage = (
            message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            ''
        ).toLowerCase().replace(/\.\s+/g, '.').trim();

        // Preserve raw message for commands like .tag that need original casing
        const rawText = message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            '';

        /*━━━━━━━━━━━━━━━━━━━━*/
        // Only log command usage    
        /*━━━━━━━━━━━━━━━━━━━━*/
        if (userMessage) { 
            /*━━━━━━━━━━━━━━━━━━━━*/
            // Safe decoding of jid     
            /*━━━━━━━━━━━━━━━━━━━━*/
            sock.decodeJid = (jid) => {
                if (!jid) return jid;
                if (/:\d+@/gi.test(jid)) {
                    let decode = jidDecode(jid) || {};
                    return decode.user && decode.server ? `${decode.user}@${decode.server}` : jid;
                } else return jid;
            };

            /*━━━━━━━━━━━━━━━━━━━━*/
            // Console log imports only  
            /*━━━━━━━━━━━━━━━━━━━━*/
            const groupMetadata = isGroup
                ? await sock.groupMetadata(chatId).catch(() => ({}))
                : {};
            const from = sock.decodeJid(message.key.remoteJid);
            const participant = sock.decodeJid(message.key.participant || from);
            const body = message.message.conversation || message.message.extendedTextMessage?.text || '';
            const pushname = message.pushName || "Unknown User";
            const chatType = chatId.endsWith('@g.us') ? 'Group' : 'Private';
            const chatName = chatType === 'Group' ? (groupMetadata?.subject || 'Unknown Group') : pushname;
            const time = new Date().toLocaleTimeString();
            
            console.log(chalk.bgHex('#121212').blue.bold(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📥 INCOMING MESSAGE: ${time}
  👤 From: ${pushname}: ${participant}
  💬 Chat Type: ${chatType}: ${chatName}
  💭 Message: ${body || "—"}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`));   
        }

        // Enforce private mode BEFORE any replies (except owner/sudo)
        try {
            const data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
            // Allow owner/sudo to use bot even in private mode
            if (!data.isPublic && !message.key.fromMe && !senderIsSudo) {
                return; // Silently ignore messages from non-owners when in private mode
            }
        } catch (error) {
            console.error('Error checking access mode:', error);
            // Default to public mode if there's an error reading the file
        }

        // Check if user is banned (skip ban check for unban command)
        if (isBanned(senderId) && !userMessage.startsWith(`${prefix}unban`)) {
            // Only respond occasionally to avoid spam
            if (Math.random() < 0.1) {
                await sock.sendMessage(chatId, {
                    text: '❌ You are banned from using the bot. Contact an admin to get unbanned.',
                    ...channelInfo
                });
            }
            return;
        }

        // First check if it's a game move
        if (/^[1-9]$/.test(userMessage) || userMessage.toLowerCase() === 'surrender') {
            await handleTicTacToeMove(sock, chatId, senderId, userMessage);
            return;
        }

        if (!message.key.fromMe) incrementMessageCount(chatId, senderId);

        // Check for bad words FIRST, before ANY other processing
        if (isGroup && userMessage) {
            await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
            await Antilink(message, sock);
        }

        // PM blocker: block non-owner DMs when enabled (do not ban)
        if (!isGroup && !message.key.fromMe && !senderIsSudo) {
            try {
                const pmState = readPmBlockerState();
                if (pmState.enabled) {
                    // Inform user, delay, then block without banning globally
                    await sock.sendMessage(chatId, { text: pmState.message || 'Private messages are blocked. Please contact the owner in groups only.' });
                    await new Promise(r => setTimeout(r, 1500));
                    try { await sock.updateBlockStatus(chatId, 'block'); } catch (e) { }
                    return;
                }
            } catch (e) { }
        }

        /*━━━━━━━━━━━━━━━━━━━━*/
        // Check for command prefix
        /*━━━━━━━━━━━━━━━━━━━━*/
        if (!userMessage.startsWith(prefix)) {
            // Show typing indicator if autotyping is enabled
            await handleAutotypingForMessage(sock, chatId, userMessage);

            if (isGroup) {
                // Process non-command messages first
                await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                await handleTagDetection(sock, chatId, message, senderId);
                await handleMentionDetection(sock, chatId, message);
            }
            return;
        }

        // List of admin commands
        const adminCommands = [
            `${prefix}mute`,
            `${prefix}unmute`,
            `${prefix}ban`,
            `${prefix}unban`,
            `${prefix}promote`,
            `${prefix}demote`,
            `${prefix}kick`,
            `${prefix}tagall`, 
            `${prefix}tagnotadmin`, 
            `${prefix}hidetag`,
            `${prefix}antilink`,
            `${prefix}antitag`, 
            `${prefix}setgdesc`, 
            `${prefix}setgname`, 
            `${prefix}setgpp`
        ];
        const isAdminCommand = adminCommands.some(cmd => userMessage.startsWith(cmd));

        // List of owner commands
        const ownerCommands = [
            `${prefix}mode`, 
            `${prefix}autostatus`, 
            `${prefix}antidelete`, 
            `${prefix}cleartmp`, 
            `${prefix}setpp`, 
            `${prefix}clearsession`, 
            `${prefix}areact`, 
            `${prefix}autoreact`, 
            `${prefix}autotyping`, 
            `${prefix}autoread`, 
            `${prefix}pmblocker`
        ];
        const isOwnerCommand = ownerCommands.some(cmd => userMessage.startsWith(cmd));

        let isSenderAdmin = false;
        let isBotAdmin = false;

        // Check admin status only for admin commands in groups
        if (isGroup && isAdminCommand) {
            const adminStatus = await isAdmin(sock, chatId, senderId, message);
            isSenderAdmin = adminStatus.isSenderAdmin;
            isBotAdmin = adminStatus.isBotAdmin;

            if (!isBotAdmin) {
                await sock.sendMessage(chatId, { text: 'Please make the bot an admin to use admin commands.', ...channelInfo }, { quoted: message });
                return;
            }

            if (
                userMessage.startsWith(`${prefix}mute`) ||
                userMessage === `${prefix}unmute` ||
                userMessage.startsWith(`${prefix}ban`) ||
                userMessage.startsWith(`${prefix}unban`) ||
                userMessage.startsWith(`${prefix}promote`) ||
                userMessage.startsWith(`${prefix}demote`)
            ) {
                if (!isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, {
                        text: 'Sorry, only group admins can use this command.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
            }
        }

        // Check owner status for owner commands
        if (isOwnerCommand) {
            if (!message.key.fromMe && !senderIsSudo) {
                await sock.sendMessage(chatId, { text: '❌ This command is only available for the owner or sudo!' }, { quoted: message });
                return;
            }
        }

        // Command handlers - Execute commands immediately without waiting for typing indicator
        let commandExecuted = false;

        switch (true) {
            /*━━━━━━━━━━━━━━━━━━━━*/
            // Prefix case 
            /*━━━━━━━━━━━━━━━━━━━━*/
            case userMessage.startsWith(`${prefix}setprefix`):
                await handleSetPrefixCommand(sock, chatId, senderId, message, userMessage, prefix);
                break;
                
            case userMessage === `${prefix}simage`:
            case userMessage === `${prefix}toimage`: {
                const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                if (quotedMessage?.stickerMessage) {
                    await simageCommand(sock, quotedMessage, chatId);
                } else {
                    await sock.sendMessage(chatId, { text: 'Please reply to a sticker with the toimage command to convert it.', ...channelInfo }, { quoted: message });
                }
                commandExecuted = true;
                break;
            }

            case userMessage.startsWith(`${prefix}kick`):
                const mentionedJidListKick = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await kickCommand(sock, chatId, senderId, mentionedJidListKick, message);
                break;

            case userMessage.startsWith(`${prefix}mute`):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const muteArg = parts[1];
                    const muteDuration = muteArg !== undefined ? parseInt(muteArg, 10) : undefined;
                    if (muteArg !== undefined && (isNaN(muteDuration) || muteDuration <= 0)) {
                        await sock.sendMessage(chatId, { text: 'Please provide a valid number of minutes or use .mute with no number to mute immediately.' }, { quoted: message });
                    } else {
                        await muteCommand(sock, chatId, senderId, message, muteDuration);
                    }
                }
                break;
                
            /*━━━━━━━━━━━━━━━━━━━━*/
            // Some owner commands
            /*━━━━━━━━━━━━━━━━━━━━*/
            case userMessage === `${prefix}unmute`:
                await unmuteCommand(sock, chatId, senderId);
                break;

            case userMessage.startsWith(`${prefix}ban`):
                await banCommand(sock, chatId, message);
                break;

            case userMessage.startsWith(`${prefix}unban`):
                await unbanCommand(sock, chatId, message);
                break;

            case userMessage === `${prefix}help` || 
                 userMessage === `${prefix}menu` ||
                 userMessage === `${prefix}list`:
                await helpCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            // Add menu configuration command
            case userMessage.startsWith(`${prefix}menuconfig`) || 
                 userMessage.startsWith(`${prefix}menuset`) || 
                 userMessage.startsWith(`${prefix}setmenu`):
                const menuArgs = userMessage.split(' ').slice(1);
                await menuConfigCommand(sock, chatId, message, menuArgs);
                commandExecuted = true;
                break;

            case userMessage === `${prefix}sticker` || 
                 userMessage === `${prefix}s`:
                await stickerCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith(`${prefix}warnings`):
                const mentionedJidListWarnings = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warningsCommand(sock, chatId, mentionedJidListWarnings);
                break;

            case userMessage.startsWith(`${prefix}warn`):
                const mentionedJidListWarn = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warnCommand(sock, chatId, senderId, mentionedJidListWarn, message);
                break;

            case userMessage.startsWith(`${prefix}tts`):
                const text = userMessage.slice((prefix + 'tts').length).trim();
                await ttsCommand(sock, chatId, text, message);
                break;

            case userMessage.startsWith(`${prefix}delete`) || userMessage.startsWith(`${prefix}del`):
                await deleteCommand(sock, chatId, message, senderId);
                break;

            case userMessage.startsWith(`${prefix}attp`):
                await attpCommand(sock, chatId, message);
                break;

            case userMessage.startsWith(`${prefix}apk`):
                await apkCommand(sock, chatId, message);
                break;
                
            /*━━━━━━━━━━━━━━━━━━━━*/
            // Settings
            /*━━━━━━━━━━━━━━━━━━━━*/
            case userMessage === `${prefix}settings`:
            case userMessage === `${prefix}getsettings`:
                await settingsCommand(sock, chatId, message);
                break;

            case userMessage.startsWith(`${prefix}mode`):
                // Check if sender is the owner
                if (!message.key.fromMe && !senderIsSudo) {
                    await sock.sendMessage(chatId, { text: 'Only bot owner can use this command!' }, { quoted: message });
                    return;
                }
                // Read current data first
                let data;
                try {
                    data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
                } catch (error) {
                    console.error('Error reading access mode:', error);
                    await sock.sendMessage(chatId, { text: 'Failed to read bot mode status', ...channelInfo });
                    return;
                }

                const action = userMessage.split(' ')[1]?.toLowerCase();
                // If no argument provided, show current status
                if (!action) {
                    const currentMode = data.isPublic ? 'public' : 'private';
                    await sock.sendMessage(chatId, {
                        text: `Current bot mode: *${currentMode}*\n\nUsage: ${prefix}mode public/private\n\nExample:\n${prefix}mode public - Allow everyone to use bot\n${prefix}mode private - Restrict to owner only` 
                    }, { quoted: message });
                    return;
                }

                if (action !== 'public' && action !== 'private') {
                    await sock.sendMessage(chatId, {
                        text: `Usage: ${prefix}mode public/private\n\nExample:\n${prefix}mode public - Allow everyone to use bot\n${prefix}mode private - Restrict to owner only`,
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }

                try {
                    // Update access mode
                    data.isPublic = action === 'public';

                    // Save updated data
                    fs.writeFileSync('./data/messageCount.json', JSON.stringify(data, null, 2));

                    await sock.sendMessage(chatId, { text: `Bot is now in *${action}* mode`, ...channelInfo });
                } catch (error) {
                    console.error('Error updating access mode:', error);
                    await sock.sendMessage(chatId, { text: 'Failed to update bot access mode', ...channelInfo });
                }
                break;

            case userMessage.startsWith(`${prefix}anticall`):
                if (!message.key.fromMe && !senderIsSudo) {
                    await sock.sendMessage(chatId, { text: 'Only owner/sudo can use anticall.' }, { quoted: message });
                    break;
                }
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    await anticallCommand(sock, chatId, message, args);
                }
                break;

            case userMessage.startsWith(`${prefix}pmblocker`):
                if (!message.key.fromMe && !senderIsSudo) {
                    await sock.sendMessage(chatId, { text: 'Only owner/sudo can use pmblocker.' }, { quoted: message });
                    commandExecuted = true;
                    break;
                }
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    await pmblockerCommand(sock, chatId, message, args);
                }
                commandExecuted = true;
                break;

            case userMessage === `${prefix}owner`:
                await ownerCommand(sock, chatId);
                break;
                
            /*━━━━━━━━━━━━━━━━━━━━*/
            // Group Commands
            /*━━━━━━━━━━━━━━━━━━━━*/
            case userMessage === `${prefix}tagall`:
                if (isSenderAdmin || message.key.fromMe) {
                    await tagAllCommand(sock, chatId, senderId, message);
                } else {
                    await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use the tagall command.', ...channelInfo }, { quoted: message });
                }
                break;

            case userMessage === `${prefix}tagnotadmin`:
                await tagNotAdminCommand(sock, chatId, senderId, message);
                break;

            case userMessage.startsWith(`${prefix}hidetag`):
                {
                    const messageText = rawText.slice((prefix + 'hidetag').length).trim();
                    const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                    await hideTagCommand(sock, chatId, senderId, messageText, replyMessage, message);
                }
                break;

            case userMessage.startsWith(`${prefix}tag`):
                const messageText = rawText.slice((prefix + 'tag').length).trim();
                const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                await tagCommand(sock, chatId, senderId, messageText, replyMessage, message);
                break;

            case userMessage.startsWith(`${prefix}antilink`):
                if (!isGroup) {
                    await sock.sendMessage(chatId, {
                        text: 'This command can only be used in groups.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, {
                        text: 'Please make the bot an admin first.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                await handleAntilinkCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message);
                break;

            case userMessage.startsWith(`${prefix}antitag`):
                if (!isGroup) {
                    await sock.sendMessage(chatId, {
                        text: 'This command can only be used in groups.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, {
                        text: 'Please make the bot an admin first.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                await handleAntitagCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message);
                break;
                
            /*━━━━━━━━━━━━━━━━━━━━*/
            // Meme Commands and etc
            /*━━━━━━━━━━━━━━━━━━━━*/
            case userMessage === `${prefix}meme`:
                await memeCommand(sock, chatId, message);
                break;

            case userMessage === `${prefix}joke`:
                await jokeCommand(sock, chatId, message);
                break;

            case userMessage === `${prefix}quote`:
                await quoteCommand(sock, chatId, message);
                break;

            case userMessage === `${prefix}fact`:
                await factCommand(sock, chatId, message, message);
                break;

            case userMessage.startsWith(`${prefix}weather`):
                const city = userMessage.slice((prefix + 'weather').length).trim();
                if (city) {
                    await weatherCommand(sock, chatId, message, city);
                } else {
                    await sock.sendMessage(chatId, { text: `Please specify a city, e.g., ${prefix}weather London`, ...channelInfo }, { quoted: message });
                }
                break;

            case userMessage === `${prefix}news`:
                await newsCommand(sock, chatId);
                break;

            case userMessage.startsWith(`${prefix}ttt`) || userMessage.startsWith(`${prefix}tictactoe`):
                const tttText = userMessage.split(' ').slice(1).join(' ');
                await tictactoeCommand(sock, chatId, senderId, tttText);
                break;

            case userMessage.startsWith(`${prefix}move`):
                const position = parseInt(userMessage.split(' ')[1]);
                if (isNaN(position)) {
                    await sock.sendMessage(chatId, { text: 'Please provide a valid position number for Tic-Tac-Toe move.', ...channelInfo }, { quoted: message });
                } else {
                    await handleTicTacToeMove(sock, chatId, senderId, position.toString());
                }
                break;

            case userMessage === `${prefix}topmembers`:
                topMembers(sock, chatId, isGroup);
                break;
                
            /*━━━━━━━━━━━━━━━━━━━━*/
            // Game commands
            /*━━━━━━━━━━━━━━━━━━━━*/
            case userMessage.startsWith(`${prefix}hangman`):
                startHangman(sock, chatId);
                break;

            case userMessage.startsWith(`${prefix}guess`):
                const guessedLetter = userMessage.split(' ')[1];
                if (guessedLetter) {
                    guessLetter(sock, chatId, guessedLetter);
                } else {
                    sock.sendMessage(chatId, { text: `Please guess a letter using ${prefix}guess <letter>`, ...channelInfo }, { quoted: message });
                }
                break;

            case userMessage.startsWith(`${prefix}trivia`):
                startTrivia(sock, chatId);
                break;

            case userMessage.startsWith(`${prefix}answer`):
                const answer = userMessage.split(' ').slice(1).join(' ');
                if (answer) {
                    answerTrivia(sock, chatId, answer);
                } else {
                    sock.sendMessage(chatId, { text: `Please provide an answer using ${prefix}answer <answer>`, ...channelInfo }, { quoted: message });
                }
                break;

            case userMessage.startsWith(`${prefix}compliment`):
                await complimentCommand(sock, chatId, message);
                break;

            case userMessage.startsWith(`${prefix}insult`):
                await insultCommand(sock, chatId, message);
                break;

            case userMessage.startsWith(`${prefix}8ball`):
                const question = userMessage.split(' ').slice(1).join(' ');
                await eightBallCommand(sock, chatId, question);
                break;

            case userMessage.startsWith(`${prefix}lyrics`):
                const songTitle = userMessage.split(' ').slice(1).join(' ');
                await lyricsCommand(sock, chatId, songTitle, message);
                break;
                
            /*━━━━━━━━━━━━━━━━━━━━*/
            // Game commands
            /*━━━━━━━━━━━━━━━━━━━━*/
            case userMessage.startsWith(`${prefix}simp`):
                const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await simpCommand(sock, chatId, quotedMsg, mentionedJid, senderId);
                break;

            case userMessage.startsWith(`${prefix}stupid`) || userMessage.startsWith(`${prefix}itssostupid`) || userMessage.startsWith(`${prefix}iss`):
                const stupidQuotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const stupidMentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                const stupidArgs = userMessage.split(' ').slice(1);
                await stupidCommand(sock, chatId, stupidQuotedMsg, stupidMentionedJid, senderId, stupidArgs);
                break;

            case userMessage === `${prefix}dare`:
                await dareCommand(sock, chatId, message);
                break;

            case userMessage === `${prefix}truth`:
                await truthCommand(sock, chatId, message);
                break;

            case userMessage === `${prefix}clear`:
                if (isGroup) await clearCommand(sock, chatId);
                break;
                
            /*━━━━━━━━━━━━━━━━━━━━*/
            // Group Command
            /*━━━━━━━━━━━━━━━━━━━━*/
            case userMessage.startsWith(`${prefix}promote`):
                const mentionedJidListPromote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await promoteCommand(sock, chatId, mentionedJidListPromote, message);
                break;

            case userMessage.startsWith(`${prefix}demote`):
                const mentionedJidListDemote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await demoteCommand(sock, chatId, mentionedJidListDemote, message);
                break;

            case userMessage === `${prefix}ping`:
                await pingCommand(sock, chatId, message);
                break;

            case userMessage === `${prefix}getpp`:
                await getppCommand(sock, chatId, message);
                break;
                
            case userMessage === `${prefix}alive`:
                await aliveCommand(sock, chatId, message);
                break;

            case userMessage.startsWith(`${prefix}mention`):
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    const isOwner = message.key.fromMe || senderIsSudo;
                    await mentionToggleCommand(sock, chatId, message, args, isOwner);
                }
                break;

            case userMessage === `${prefix}setmention`:
                {
                    const isOwner = message.key.fromMe || senderIsSudo;
                    await setMentionCommand(sock, chatId, message, isOwner);
                }
                break;

            case userMessage.startsWith(`${prefix}blur`):
                const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                await blurCommand(sock, chatId, message, quotedMessage);
                break;

            case userMessage.startsWith(`${prefix}welcome`):
                if (isGroup) {
                    // Check admin status if not already checked
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }

                    if (isSenderAdmin || message.key.fromMe) {
                        await welcomeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use this command.', ...channelInfo }, { quoted: message });
                    }
                } else {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                }
                break;

            case userMessage.startsWith(`${prefix}goodbye`):
                if (isGroup) {
                    // Check admin status if not already checked
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }

                    if (isSenderAdmin || message.key.fromMe) {
                        await goodbyeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use this command.', ...channelInfo }, { quoted: message });
                    }
                } else {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                }
                break;
                
            /*━━━━━━━━━━━━━━━━━━━━*/
            // GitHub
            /*━━━━━━━━━━━━━━━━━━━━*/
            case userMessage === `${prefix}git`:
            case userMessage === `${prefix}github`:
            case userMessage === `${prefix}sc`:
            case userMessage === `${prefix}script`:
            case userMessage === `${prefix}repo`:
                await githubCommand(sock, chatId, message);
                break;

            case userMessage.startsWith(`${prefix}antibadword`):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                    return;
                }

                const adminStatus = await isAdmin(sock, chatId, senderId);
                isSenderAdmin = adminStatus.isSenderAdmin;
                isBotAdmin = adminStatus.isBotAdmin;

                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, { text: '*Bot must be admin to use this feature*', ...channelInfo }, { quoted: message });
                    return;
                }

                await antibadwordCommand(sock, chatId, message, senderId, isSenderAdmin);
                break;

            case userMessage.startsWith(`${prefix}chatbot`):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                    return;
                }

                // Check if sender is admin or bot owner
                const chatbotAdminStatus = await isAdmin(sock, chatId, senderId);
                if (!chatbotAdminStatus.isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, { text: '*Only admins or bot owner can use this command*', ...channelInfo }, { quoted: message });
                    return;
                }
                
            /*━━━━━━━━━━━━━━━━━━━━*/
            // Some sticker cmds & fun
            /*━━━━━━━━━━━━━━━━━━━━*/
                const match = userMessage.slice((prefix + 'chatbot').length).trim();
                await handleChatbotCommand(sock, chatId, message, match);
                break;

            case userMessage.startsWith(`${prefix}take`):
                const takeArgs = rawText.slice((prefix + 'take').length).trim().split(' ');
                await takeCommand(sock, chatId, message, takeArgs);
                break;

            case userMessage === `${prefix}flirt`:
                await flirtCommand(sock, chatId, message);
                break;

            case userMessage.startsWith(`${prefix}character`):
                await characterCommand(sock, chatId, message);
                break;

            case userMessage.startsWith(`${prefix}waste`):
                await wastedCommand(sock, chatId, message);
                break;

            case userMessage === `${prefix}ship`:
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await shipCommand(sock, chatId, message);
                break;
                
            /*━━━━━━━━━━━━━━━━━━━━*/
            // Some group Commands
            /*━━━━━━━━━━━━━━━━━━━━*/
            case userMessage === `${prefix}groupinfo` || 
                 userMessage === `${prefix}infogroup` || 
                 userMessage === `${prefix}infogrupo`:
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await groupInfoCommand(sock, chatId, message);
                break;

            case userMessage === `${prefix}reset` || userMessage === `${prefix}revoke`:
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await resetlinkCommand(sock, chatId, senderId);
                break;

            case userMessage === `${prefix}admin` ||
                 userMessage === `${prefix}listadmin`:
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await staffCommand(sock, chatId, message);
                break;

            case userMessage.startsWith(`${prefix}tourl`) || 
                 userMessage.startsWith(`${prefix}url`):
                await urlCommand(sock, chatId, message);
                break;

            case userMessage.startsWith(`${prefix}emojimix`) ||
                 userMessage.startsWith(`${prefix}emix`):
                await emojimixCommand(sock, chatId, message);
                break;

            case userMessage.startsWith(`${prefix}tg`) ||
                 userMessage.startsWith(`${prefix}tgsticker`):
                await stickerTelegramCommand(sock, chatId, message);
                break;
                
            /*━━━━━━━━━━━━━━━━━━━━*/
            // Other Commands
            /*━━━━━━━━━━━━━━━━━━━━*/
            case userMessage === `${prefix}vv`:
                await viewOnceCommand(sock, chatId, message);
                break;

            case userMessage === `${prefix}clearsession` || userMessage === `${prefix}clearsesi`:
                await clearSessionCommand(sock, chatId, message);
                break;

            case userMessage.startsWith(`${prefix}autostatus`):
                const autoStatusArgs = userMessage.split(' ').slice(1);
                await autoStatusCommand(sock, chatId, message, autoStatusArgs);
                break;

            case userMessage.startsWith(`${prefix}metallic`):
                await textmakerCommand(sock, chatId, message, userMessage, 'metallic');
                break;

            case userMessage.startsWith(`${prefix}ice`):
                await textmakerCommand(sock, chatId, message, userMessage, 'ice');
                break;

            case userMessage.startsWith(`${prefix}snow`):
                await textmakerCommand(sock, chatId, message, userMessage, 'snow');
                break;

            case userMessage.startsWith(`${prefix}impressive`):
                await textmakerCommand(sock, chatId, message, userMessage, 'impressive');
                break;

            case userMessage.startsWith(`${prefix}matrix`):
                await textmakerCommand(sock, chatId, message, userMessage, 'matrix');
                break;

            case userMessage.startsWith(`${prefix}light`):
                await textmakerCommand(sock, chatId, message, userMessage, 'light');
                break;

            case userMessage.startsWith(`${prefix}neon`):
                await textmakerCommand(sock, chatId, message, userMessage, 'neon');
                break;

            case userMessage.startsWith(`${prefix}devil`):
                await textmakerCommand(sock, chatId, message, userMessage, 'devil');
                break;

            case userMessage.startsWith(`${prefix}purple`):
                await textmakerCommand(sock, chatId, message, userMessage, 'purple');
                break;

            case userMessage.startsWith(`${prefix}thunder`):
                await textmakerCommand(sock, chatId, message, userMessage, 'thunder');
                break;

            case userMessage.startsWith(`${prefix}leaves`):
                await textmakerCommand(sock, chatId, message, userMessage, 'leaves');
                break;

            case userMessage.startsWith(`${prefix}1917`):
                await textmakerCommand(sock, chatId, message, userMessage, '1917');
                break;

            case userMessage.startsWith(`${prefix}arena`):
                await textmakerCommand(sock, chatId, message, userMessage, 'arena');
                break;

            case userMessage.startsWith(`${prefix}hacker`):
                await textmakerCommand(sock, chatId, message, userMessage, 'hacker');
                break;

            case userMessage.startsWith(`${prefix}sand`):
                await textmakerCommand(sock, chatId, message, userMessage, 'sand');
                break;

            case userMessage.startsWith(`${prefix}blackpink`):
                await textmakerCommand(sock, chatId, message, userMessage, 'blackpink');
                break;

            case userMessage.startsWith(`${prefix}glitch`):
                await textmakerCommand(sock, chatId, message, userMessage, 'glitch');
                break;

            case userMessage.startsWith(`${prefix}fire`):
                await textmakerCommand(sock, chatId, message, userMessage, 'fire');
                break;

            case userMessage.startsWith(`${prefix}antidelete`):
                const antideleteMatch = userMessage.slice((prefix + 'antidelete').length).trim();
                await handleAntideleteCommand(sock, chatId, message, antideleteMatch);
                break;

            case userMessage === `${prefix}surrender`:
                await handleTicTacToeMove(sock, chatId, senderId, 'surrender');
                break;

            case userMessage === `${prefix}cleartemp`:
                await clearTmpCommand(sock, chatId, message);
                break;

            case userMessage === `${prefix}setpp`:
                await setProfilePicture(sock, chatId, message);
                break;

            case userMessage.startsWith(`${prefix}setgdesc`):
                {
                    const text = rawText.slice((prefix + 'setgdesc').length).trim();
                    await setGroupDescription(sock, chatId, senderId, text, message);
                }
                break;

            case userMessage.startsWith(`${prefix}setgname`):
                {
                    const text = rawText.slice((prefix + 'setgname').length).trim();
                    await setGroupName(sock, chatId, senderId, text, message);
                }
                break;

            case userMessage.startsWith(`${prefix}setgpp`):
                await setGroupPhoto(sock, chatId, senderId, message);
                break;

            /*━━━━━━━━━━━━━━━━━━━━*/
            // Social media downloads
            /*━━━━━━━━━━━━━━━━━━━━*/
            case userMessage.startsWith(`${prefix}instagram`) ||
                 userMessage.startsWith(`${prefix}insta`) ||
                 (userMessage === `${prefix}ig` || userMessage.startsWith(`${prefix}ig `)):
                await instagramCommand(sock, chatId, message);
                break;

            case userMessage.startsWith(`${prefix}igs`):
                await igsCommand(sock, chatId, message, true);
                break;

            case userMessage.startsWith(`${prefix}fb`) || userMessage.startsWith(`${prefix}facebook`):
                await facebookCommand(sock, chatId, message);
                break;

            /*━━━━━━━━━━━━━━━━━━━━*/
            // Song & play command cases
            /*━━━━━━━━━━━━━━━━━━━━*/             
            case userMessage.startsWith(`${prefix}play`):
                await playCommand(sock, chatId, message);
                break;

            case userMessage.startsWith(`${prefix}spotify`): 
                await spotifyCommand(sock, chatId, message);
                break;
                
            case userMessage.startsWith(`${prefix}song`) ||
                 userMessage.startsWith(`${prefix}mp3`):
                await songCommand(sock, chatId, message);
                break;
    
            case userMessage.startsWith(`${prefix}video`):
                await videoCommand(sock, chatId, message);
                break;

            case userMessage.startsWith(`${prefix}tiktok`) ||
                 userMessage.startsWith(`${prefix}tt`):
                await tiktokCommand(sock, chatId, message);
                break;

            /*━━━━━━━━━━━━━━━━━━━━*/
            // AI & gemini cmd cases
            /*━━━━━━━━━━━━━━━━━━━━*/               
            case userMessage.startsWith(`${prefix}gpt`) || 
                 userMessage.startsWith(`${prefix}gemini`):
                await aiCommand(sock, chatId, message);
                break;

            case userMessage.startsWith(`${prefix}translate`) || 
                 userMessage.startsWith(`${prefix}trt`):
                const commandLength = userMessage.startsWith(`${prefix}translate`) ? (prefix + 'translate').length : (prefix + 'trt').length;
                await handleTranslateCommand(sock, chatId, message, userMessage.slice(commandLength));
                return;

            case userMessage.startsWith(`${prefix}ss`) ||
                 userMessage.startsWith(`${prefix}ssweb`) || 
                 userMessage.startsWith(`${prefix}screenshot`):
                const ssCommandLength = userMessage.startsWith(`${prefix}screenshot`) ? (prefix + 'screenshot').length : (userMessage.startsWith(`${prefix}ssweb`) ? (prefix + 'ssweb').length : (prefix + 'ss').length);
                await handleSsCommand(sock, chatId, message, userMessage.slice(ssCommandLength).trim());
                break;

            case userMessage.startsWith(`${prefix}areact`) || 
                 userMessage.startsWith(`${prefix}autoreact`) ||
                 userMessage.startsWith(`${prefix}autoreaction`):
                const isOwnerOrSudo = message.key.fromMe || senderIsSudo;
                await handleAreactCommand(sock, chatId, message, isOwnerOrSudo);
                break;

            case userMessage.startsWith(`${prefix}sudo`):
                await sudoCommand(sock, chatId, message);
                break;

            case userMessage === `${prefix}goodnight` || 
                 userMessage === `${prefix}lovenight` || 
                 userMessage === `${prefix}gn`:
                await goodnightCommand(sock, chatId, message);
                break;

            case userMessage === `${prefix}shayari` || 
                 userMessage === `${prefix}shayri`:
                await shayariCommand(sock, chatId, message);
                break;

            case userMessage === `${prefix}roseday`:
                await rosedayCommand(sock, chatId, message);
                break;

            case userMessage.startsWith(`${prefix}imagine`) || 
                 userMessage.startsWith(`${prefix}flux`) || 
                 userMessage.startsWith(`${prefix}dalle`): 
                await imagineCommand(sock, chatId, message);
                break;

            case userMessage === `${prefix}jid`:
                await groupJidCommand(sock, chatId, message);
                break;

            case userMessage.startsWith(`${prefix}autotyping`):
                await autotypingCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith(`${prefix}autoread`):
                await autoreadCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith(`${prefix}heart`):
                await handleHeart(sock, chatId, message);
                break;

            case userMessage.startsWith(`${prefix}horny`):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['horny', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;

            case userMessage.startsWith(`${prefix}circle`):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['circle', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;

            case userMessage.startsWith(`${prefix}lgbtq`):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['lgbtq', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;

            case userMessage.startsWith(`${prefix}lolice`):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['lolice', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;

            case userMessage.startsWith(`${prefix}simpcard`):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['simpcard', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;

            case userMessage.startsWith(`${prefix}misc`):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['misc', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;

            case userMessage.startsWith(`${prefix}its-so-stupid`):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['its-so-stupid', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;

            case userMessage.startsWith(`${prefix}namecard`):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['namecard', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;

            case userMessage.startsWith(`${prefix}oogway2`):
            case userMessage.startsWith(`${prefix}oogway`):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const sub = userMessage.startsWith(`${prefix}oogway2`) ? 'oogway2' : 'oogway';
                    const args = [sub, ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;

            case userMessage.startsWith(`${prefix}tweet`):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['tweet', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;

            case userMessage.startsWith(`${prefix}ytcomment`):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['youtube-comment', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
                
            /*━━━━━━━━━━━━━━━━━━━━*/
            // Photo Effects Command
            /*━━━━━━━━━━━━━━━━━━━━*/
            case userMessage.startsWith(`${prefix}comrade`):
            case userMessage.startsWith(`${prefix}gay`):
            case userMessage.startsWith(`${prefix}glass`):
            case userMessage.startsWith(`${prefix}jail`):
            case userMessage.startsWith(`${prefix}passed`):
            case userMessage.startsWith(`${prefix}triggered`):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const sub = userMessage.slice(prefix.length).split(/\s+/)[0];
                    const args = [sub, ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
                
            /*━━━━━━━━━━━━━━━━━━━━*/
            // Anime commands
            /*━━━━━━━━━━━━━━━━━━━━*/
            case userMessage.startsWith(`${prefix}animu`):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = parts.slice(1);
                    await animeCommand(sock, chatId, message, args);
                }
                break;

            // Anime aliases
            case userMessage.startsWith(`${prefix}nom`):
            case userMessage.startsWith(`${prefix}poke`):
            case userMessage.startsWith(`${prefix}cry`):
            case userMessage.startsWith(`${prefix}hug`):
            case userMessage.startsWith(`${prefix}pat`):
            case userMessage.startsWith(`${prefix}kiss`):
            case userMessage.startsWith(`${prefix}wink`):
            case userMessage.startsWith(`${prefix}facepalm`):
            case userMessage.startsWith(`${prefix}face-palm`): 
            case userMessage.startsWith(`${prefix}loli`):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    let sub = parts[0].slice(prefix.length);
                    if (sub === 'facepalm') sub = 'face-palm';
                    await animeCommand(sock, chatId, message, [sub]);
                }
                break;

            case userMessage === `${prefix}crop`:
                await stickercropCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith(`${prefix}pies`):
                {
                    const parts = rawText.trim().split(/\s+/);
                    const args = parts.slice(1);
                    await piesCommand(sock, chatId, message, args);
                    commandExecuted = true;
                }

        break;
            case userMessage === '.china':
                await piesAlias(sock, chatId, message, 'china');
                commandExecuted = true;
                break;
            case userMessage === '.indonesia':
                await piesAlias(sock, chatId, message, 'indonesia');
                commandExecuted = true;
                break;
            case userMessage === '.japan':
                await piesAlias(sock, chatId, message, 'japan');
                commandExecuted = true;
                break;
            case userMessage === '.korea':
                await piesAlias(sock, chatId, message, 'korea');
                commandExecuted = true;
                break;
            case userMessage === '.hijab':
                await piesAlias(sock, chatId, message, 'hijab');
                commandExecuted = true;
                break;
            case userMessage.startsWith('.update'):
            case userMessage.startsWith('.start'):
            case userMessage.startsWith('.restart'):
                {
                    const parts = rawText.trim().split(/\s+/);
                    const zipArg = parts[1] && parts[1].startsWith('http') ? parts[1] : '';
                    await updateCommand(sock, chatId, message, senderIsSudo, zipArg);
                }
                commandExecuted = true;
                break;
            case userMessage.startsWith('.removebg') || userMessage.startsWith('.rmbg') || userMessage.startsWith('.nobg'):
                await removebgCommand.exec(sock, message, userMessage.split(' ').slice(1));
                break;
            case userMessage.startsWith('.remini') || userMessage.startsWith('.enhance') || userMessage.startsWith('.upscale'):
                await reminiCommand(sock, chatId, message, userMessage.split(' ').slice(1));
                break;
            case userMessage.startsWith('.sora'):
                await soraCommand(sock, chatId, message);
                break;
            default:
                if (isGroup) {
                    // Handle non-command group messages
                    if (userMessage) {  // Make sure there's a message
                        await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                    }
                    await handleTagDetection(sock, chatId, message, senderId);
                    await handleMentionDetection(sock, chatId, message);
                }
                commandExecuted = false;
                break;
        }

        // If a command was executed, show typing status after command execution
        if (commandExecuted !== false) {
            // Command was executed, now show typing status after command execution
            await showTypingAfterCommand(sock, chatId);
        }

        // Function to handle .groupjid command
        async function groupJidCommand(sock, chatId, message) {
            const groupJid = message.key.remoteJid;

            if (!groupJid.endsWith('@g.us')) {
                return await sock.sendMessage(chatId, {
                    text: "❌ This command can only be used in a group."
                });
            }

            await sock.sendMessage(chatId, {
                text: `✅ Group JID: ${groupJid}`
            }, {
                quoted: message
            });
        }

        if (userMessage.startsWith('.')) {
            // After command is processed successfully
            await addCommandReaction(sock, message);
        }
    } catch (error) {
        console.error('❌ Error in message handler:', error.message);
        // Only try to send error message if we have a valid chatId
        if (chatId) {
            await sock.sendMessage(chatId, {
                text: '❌ Failed to process command!',
                ...channelInfo
            });
        }
    }
}

async function handleGroupParticipantUpdate(sock, update) {
    try {
        const { id, participants, action, author } = update;

        // Check if it's a group
        if (!id.endsWith('@g.us')) return;

        // Respect bot mode: only announce promote/demote in public mode
        let isPublic = true;
        try {
            const modeData = JSON.parse(fs.readFileSync('./data/messageCount.json'));
            if (typeof modeData.isPublic === 'boolean') isPublic = modeData.isPublic;
        } catch (e) {
            // If reading fails, default to public behavior
        }

        // Handle promotion events
        if (action === 'promote') {
            if (!isPublic) return;
            await handlePromotionEvent(sock, id, participants, author);
            return;
        }

        // Handle demotion events
        if (action === 'demote') {
            if (!isPublic) return;
            await handleDemotionEvent(sock, id, participants, author);
            return;
        }

        // Handle join events
        if (action === 'add') {
            await handleJoinEvent(sock, id, participants);
        }

        // Handle leave events
        if (action === 'remove') {
            await handleLeaveEvent(sock, id, participants);
        }
    } catch (error) {
        console.error('Error in handleGroupParticipantUpdate:', error);
    }
}

// Instead, export the handlers along with handleMessages
module.exports = {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus: async (sock, status) => {
        await handleStatusUpdate(sock, status);
    }
};

