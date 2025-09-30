/**
 * June MD - Basic Settings
 */

const fs = require('fs');

// Session Configuration
global.sessionId = process.env.SESSION_ID || "Caseyrhodes~YOUR_SESSION_ID_HERE";

// Owner Configuration
global.owner = process.env.OWNER_NUMBER || "254112192119";
global.ownerName = process.env.OWNER_NAME || "CaseyRhodes";

// Bot Configuration
global.botname = "JUNE MD BOT";
global.prefix = ".";

// Export settings
module.exports = {
    sessionId: global.sessionId,
    owner: global.owner,
    ownerName: global.ownerName,
    botname: global.botname,
    prefix: global.prefix
};
