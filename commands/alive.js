const settings = require("../settings");
async function aliveCommand(sock, chatId, message) {
    try {
        const message1 =
                       `*Version:* ${settings.version}\n` +
                       `*Status:* Online\n` +
                       `*Mode:* Public\n\n` +
                       `Type *.menu* for full command list`;

        await sock.sendMessage(chatId, {
            text: message1,
            image: {url: },
             hasMediaAttachment: true,
            contextInfo: {
                forwardingScore: 999,
                remoteJid: "status@broadcast",
                isForwarded: true, 
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '',
                    newsletterName: ' MD',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
        
        //send audio
         sock.sendMessage(chatId, {
                        audio: {url:'https://url.bwmxmd.online/Adams.0eltfmev.mp3'},
                        mimetype: 'audio/mp4',
                        ptt: true
                    }, {
                        quoted: message
                    });
                    
    } catch (error) {
        console.error('Error in alive command:', error);
        await sock.sendMessage(chatId, { text: 'Bot is alive and running!' }, { quoted: message });
    }
}

module.exports = aliveCommand;

