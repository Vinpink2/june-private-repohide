const settings = require('../settings');
const fs = require('fs');
const path = require('path');
const os = require('os');
const chatId = message.key.remoteJid;

const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);



function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds = seconds % (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds = seconds % (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';
    if (days > 0) time += `${days}d `;
    if (hours > 0) time += `${hours}h `;
    if (minutes > 0) time += `${minutes}m `;
    if (seconds > 0 || time === '') time += `${seconds}s`;

    return time.trim();
}

// 🧩 Host Detection Function
function detectHost() {
    const env = process.env;

    if (env.RENDER || env.RENDER_EXTERNAL_URL) return 'Render';
    if (env.DYNO || env.HEROKU_APP_DIR || env.HEROKU_SLUG_COMMIT) return 'Heroku';
    if (env.VERCEL || env.VERCEL_ENV || env.VERCEL_URL) return 'Vercel';
    if (env.PORTS || env.CYPHERX_HOST_ID) return "CypherXHost";
    if (env.RAILWAY_ENVIRONMENT || env.RAILWAY_PROJECT_ID) return 'Railway';
    if (env.REPL_ID || env.REPL_SLUG) return 'Replit';

    const hostname = os.hostname().toLowerCase();
    if (!env.CLOUD_PROVIDER && !env.DYNO && !env.VERCEL && !env.RENDER) {
        if (hostname.includes('vps') || hostname.includes('server')) return 'VPS';
        return 'Panel';
    }

    return 'Unknown Host';
}


async function helpCommand(sock, chatId, message) {
    

    let data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
    const start = Date.now();
    await sock.sendMessage(chatId, { text: '_Wait Loading Menu..._' }, { quoted: message });
    const end = Date.now();
    const ping = Math.round((end - start) / 2);

const uptimeInSeconds = process.uptime();
const uptimeFormatted = formatTime(uptimeInSeconds);
const currentMode = data.isPublic ? 'public' : 'private';    
const hostName = detectHost();
    
    const helpMessage = `
┏❐  *❴ 𝙹𝚄𝙽𝙴-𝙼𝙳 𝙼𝙸𝙽𝙸 ❵* ❐
┃➥ *prefix:* [.]
┃➥ *Mode:* ${currentMode}
┃➥ *Host:* ${hostName}
┃➥ *Speed:* ${ping} ms
┃➥ *Uptime:* ${uptimeFormatted}
┃➥ *version:* v${settings.version}
┗❐
  ${readmore} 
┏❐ \`OWNER MENU\` ❐
┃ .ban
┃ .restart
┃ .unban
┃ .promote
┃ .demote
┃ .mute 
┃ .unmute
┃ .delete
┃ .kick
┃ .warnings
┃ .antilink
┃ .antibadword
┃ .clear
┃ .chatbot
┗❐

┏❐ \`GROUP MENU\` ❐
┃ .promote
┃ .demote
┃ .settings
┃ .welcome
┃ .setgpp
┃ .getgpp
┃ .listadmin
┃ .goodbye
┃ .tagnoadmin
┃ .tag 
┃ .antilink
┃ .set welcome
┃ .listadmin
┃ .groupinfo
┃ .admins 
┃ .warn
┃ .revoke
┃ .resetlink
┃ .open
┃ .close
┃ .mention
┗❐

┏❐ \`AI MENU\` ❐
┃ .Ai
┃ .gpt
┃ .gemini
┃ .imagine
┃ .flux
┗❐  
  ${readmore}
┏❐ \`SETTING MENU\` ❐
┃ .mode
┃ .autostatus
┃ .pmblock
┃ .setmention
┃ .autoread
┃ .clearsession
┃ .antidelete
┃ .cleartmp
┃ .autoreact
┃ .getpp
┃ .setpp
┃ .sudo
┃ .autotyping 
┗❐
  
┏❐ \`MAIN MENU\` ❐
┃ .url
┃ .tagall
┃ .yts
┃ .play
┃ .spotify
┃ .trt
┃ .alive
┃ .ping 
┃ .vv
┃ .video
┃ .song
┃ .ssweb
┃ .instagram
┃ .facebook
┃ .tiktok 
┃ .ytmp4
┗❐

┏❐ \`STICK MENU\` ❐
┃ .blur
┃ .simage 
┃ .sticker
┃ .tgsticker
┃ .meme
┃ .take 
┃ .emojimix
┗❐

┏❐ \`GAME MENU\` ❐
┃ .tictactoe 
┃ .hangman
┃ .guess 
┃ .trivia
┃ .answer
┃ .truth
┃ .dare
┃ .8ball
┗❐

┏❐ \`GITHUB CMD\` ❐
┃ .git
┃ .github
┃ .sc
┃ .script
┃ .repo
┗❐
  ${readmore}
┏❐ \`MAKER MENU\`❐
┃ .compliment
┃ .insult
┃ .flirt 
┃ .shayari
┃ .goodnight
┃ .roseday
┃ .character
┃ .wasted
┃ .ship 
┃ .simp
┃ .stupid
┗❐

┏❐ \`ANIME MENU\` ❐
┃ .neko
┃ .waifu
┃ .loli
┃ .nom 
┃ .poke 
┃ .cry 
┃ .kiss 
┃ .pat 
┃ .hug 
┃ .wink 
┃ .facepalm 
┗❐
 
┏❐ \`MAKER MENU\` ❐
┃ .metallic 
┃ .ice 
┃ .snow
┃ .impressive
┃ .matrix
┃ .light
┃ .neon
┃ .devil
┃ .purple
┃ .thunder
┃ .leaves
┃ .1917 
┃ .arena
┃ .hacker
┃ .sand
┃ .blackpink
┃ .glitch
┃ .fire 
┗❐
 
┏❐ \`IMG EDDIT\` ❐
┃ .heart
┃ .horny
┃ .circle
┃ .lgbt
┃ .lolice
┃ .stupid
┃ .namecard 
┃ .tweet
┃ .ytcomment 
┃ .comrade 
┃ .gay 
┃ .glass 
┃ .jail 
┃ .passed 
┃ .triggered
┗❐
`;

    // reaction dureing reaction
     await sock.sendMessage(chatId, {
            react: { text: '📔', key: message.key }
        });

    
    try {
        const imagePath = path.join(__dirname, '../assets/menu.jpg');
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            await sock.sendMessage(
                chatId,
                {
                    image: imageBuffer,
                    caption: helpMessage,
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363421502047121@newsletter',
                            newsletterName: 'June Official',
                            serverMessageId: -1
                        }
                    }
                },
                { quoted: message }
            );
            
    //successful menu react ✅
            
         await sock.sendMessage(chatId, {
            react: { text: '✔️', key: message.key }
        });
            

            
        } else {
            await sock.sendMessage(chatId, {
                text: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363421502047121@newsletter',
                        newsletterName: 'June Official',
                        serverMessageId: -1
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;
