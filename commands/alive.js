const settings = require("../settings");
async function aliveCommand(sock, chatId, message) {
    try {
        const message1 =
                       `*VERSION:* ${settings.version}\n` +
                       `*STATUS:* Online\n` +
                       `*MODE:* Public\n\n` +
                       `TYPE *.menu* for full commands`;

        await sock.sendMessage(chatId, {
            text: message1,
            hasMediaAttachment: true,
            contextInfo: {
                forwardingScore: 99,
                remoteJid: "status@broadcast",
                isForwarded: false, 
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '',
                    newsletterName: ' MD',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
        
        //send audio
        const audioPath = path.join(__dirname, '../assets/audio.mp3');
         sock.sendMessage(chatId, {
                        audio: audioPath,
                        mimetype: 'audio/mp4',
                        ptt: false
                    }, {
                        quoted: message
                    });
                    
    } catch (error) {
        console.error('Error in alive command:', error);
        await sock.sendMessage(chatId, { text: 'Bot is alive and running!' }, { quoted: message });
    }
}

module.exports = aliveCommand;

