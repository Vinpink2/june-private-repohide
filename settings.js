const fs = require('fs')
const path = require('path')
if (fs.existsSync(path.join(__dirname, './.env'))) {
    require('dotenv').config({ path: path.join(__dirname, './.env') })
}


const settings = {
  packname: process.env.PACK_NAME || '',
  author: process.env.AUTHOR || '',
  botName: process.env.BOT_NEME || '',
  botOwner: process.env.BOT_OWNER || '', // Your name
  ownerNumber: process.env.OWNER_NO || , //Set your number here without + symbol, just add country code & number without any space
  giphyApiKey: 'qnl7ssQChTdPjsKta2Ax2LMaGXz303tq',
  commandMode: process.env.MODE || '',
  maxStoreMessages: 20, 
  storeWriteInterval: 10000,
  description: "This is a bot for managing group commands and automating tasks.",
  version: "2.6.0",
  updateZipUrl: "https://github.com/vinpink2/june-private-repohide/archive/refs/heads/main.zip",
  
};

module.exports = settings;
