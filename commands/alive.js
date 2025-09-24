const settings = require("../settings");
async function aliveCommand(sock, chatId, message) {
    try {
        const message1 = `*🤖 𝐉ᴜɴᴇ 𝐌ᴅ is Active!\n\n✅ Bot Version:* ${settings.version}`;

        await sock.sendMessage(chatId, {
            text: message1,
            image: {url: 'https://files.catbox.moe/7ibt7j.jpg' },
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '',
                    newsletterName: ' MD',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
    } catch (error) {
        console.error('Error in alive command:', error);
        await sock.sendMessage(chatId, { text: 'Bot is alive and running!' }, { quoted: message });
    }
}

module.exports = aliveCommand;
