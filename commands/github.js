const moment = require('moment-timezone');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function githubCommand(sock, chatId, message) {
  try {
    
const pushname = message.pushName || "Unknown User";
    const res = await fetch('https://api.github.com/repos/vinpink2/June-md');
    if (!res.ok) throw new Error('Error fetching repository data');
    const json = await res.json();

    let txt = 
           `🔹  \`JUNE-X REPO INFO.\` \n\n`;
    txt += `🔸  *Name* : ${json.name}\n`;
    txt += `🔸  *Watchers* : ${json.watchers_count}\n`;
    txt += `🔸  *Size* : ${(json.size / 1024).toFixed(2)} MB\n`;
    txt += `🔸  *Last Updated* : ${moment(json.updated_at).format('DD/MM/YY - HH:mm:ss')}\n`;
    txt += `🔸  *REPO* : ${json.html_url}\n\n`;    
    txt += `🔹  *Forks* : ${json.forks_count}\n`;
    txt += `🔹  *Stars* : ${json.stargazers_count}\n`;
    txt += `🔹  *Desc* : ${json.description || 'None'}\n\n`;
    txt += `@${pushname} _Thank you for choosing,  Star ⭐ & fork 🔁_`;

    // Use the local asset image
    const imgPath = path.join(__dirname, '../assets/menu2.jpg');
    const imgBuffer = fs.readFileSync(imgPath);

    /*await sock.sendMessage(chatId, { image: imgBuffer, caption: txt }, { quoted: message });*/
      
        await sock.sendMessage(chatId, {
            image: imgBuffer,
            caption: txt,
            contextInfo: {
                externalAdReply: {
                    title: 'June Official Repo',
                    body: "𝐉ᴜɴᴇ 𝐌ᴅ",
                    mediaType: 1,
                    sourceUrl: "https://github.com/Vinpink2",
                    thumbnailUrl: "https://files.catbox.moe/a0gfje.jpg",
                    renderLargerThumbnail: false,
                    showAdAttribution: false
                }
            }
        },{ quoted:message});      
      
      
      
//arect sucess💉
    await sock.sendMessage(chatId, {
            react: { text: '✔️', key: message.key }
        });
    
  } catch (error) {
    await sock.sendMessage(chatId, { text: '❌ Error fetching repository information.' }, { quoted: message });
  }
}

module.exports = githubCommand; 
