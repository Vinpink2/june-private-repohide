const fs = require('fs')
const chalk = require('chalk')
if (fs.existsSync('.env')) require('dotenv').config({ path: __dirname+'/.env' })


global.SESSION_ID = process.env.SESSION_ID || '' 
//~~~~~~~~~~~ Settings Owner ~~~~~~~~~~~//
global.owner = "254756280512"
global.developer = "254756280512"
global.bot = ""
global.devname = "Supreme"
global.ownername = process.env.OWNER_NAME ||'Supreme'
global.botname = "June Md"
global.versisc = "2"
global.packname = "⎋June Md"
//~~~~~~~~~~~ Settings Sosmed ~~~~~~~~~~~//
global.linkwa = "https://wa.me/254756280512"
global.linkyt = "https://www.youtube.com/supreme"
global.linktt = "https://tiktok.com"
global.linktele = "https://t.me"

//~~~~~~~~~~~ Settings Bot ~~~~~~~~~~~//
global.prefix = process.env.BOT_PREFIX ||'.'
global.autoRecording = false
global.autoTyping = false
global.autorecordtype = false
global.autoread = process.env.AUTO_READ || false
global.autobio = false
global.anti92 = false
global.owneroff = false
global.statusview = process.env.AUTO_STATUS || true

//~~~~~~~~~~~ Settings Thumbnail ~~~~~~~~~~~//
global.thumbbot = "https://url.bwmxmd.online/Adams.poh4tuhs.jpg"
global.thumbown = "https://url.bwmxmd.online/Adams.poh4tuhs.jpg"

//~~~~~~~~~~~ Settings Channel ~~~~~~~~~~~//
global.idchannel = "120363402785346228@newsletter*"
global.channelname = "ーJUNE MD UPDATES"
global.channel = "hatsapp.com/channel/0029Vb2W2vAADTOKmdoDxB0m"

//~~~~~~~~~~~ Settings Message ~~~~~~~~~~~//
global.mess = {
  developer: " `[ Developer Only!! ]` \n This feature is for developers only!!",
  owner: " `[ Owner Only!! ]` \n This feature is for owners only!!",
  group: " `[ Group Only!! ]` \n This feature is for group chats only!!",
  private: " `[ Private Only!! ]` \n This feature is for private chats only!!",
  admin: " `[ Admin Only!! ]` \n This feature is for admins only!!",
  botadmin: " `[ Bot Admin Only!! ]` \n This feature is for bot admins only!!",
  wait: " `[ Wait!! ]` \n Please wait, loading...",
  error: " `[ Error!! ]` \n An error occurred!!",
  done: " `[ Done!! ]` \n Process completed!!"
}

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
