





async function cloneCommand(sock, chatId, message) {
                try {
                    if (!args[0]) return 
                    await sock.sendMessage(chatId, { text:  }, { quoted: message });
                    if (!args[0].includes('github.com')) return
                    await sock.sendMessage(chatId, { text:  }, { quoted: message });
                    const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
                    let [, user, repo] = args[0].match(regex) || [];
                    repo = repo.replace(/.git$/, '');
                    const zipUrl = `https://api.github.com/repos/${user}/${repo}/zipball`;
                    const head = await fetch(zipUrl, { method: 'HEAD' });
                    const contentDisp = head.headers.get('content-disposition');
                    const filenameMatch = contentDisp?.match(/attachment; filename=(.*)/);
                    const filename = filenameMatch ? filenameMatch[1] : `${repo}.zip`;
                    await sock.sendMessage(from, { document: { url: zipUrl }, fileName: filename, mimetype: 'application/zip' }, { quoted: message });
                    
                    await sock.sendMessage(chatId, { text: `✅ Successfully fetched repository: *${user}/${repo}` }, { quoted: message });
                    
                } catch (err) {
                    console.error("gitclone error:", err);
                    await sock.sendMessage(chatId, { text: "❌ fail to fetch repo zip" }, { quoted: message });
                }
                
            }                     
            
            
module.exports = cloneCommand            
            
