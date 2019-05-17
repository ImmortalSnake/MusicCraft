const { Client } = require('discord.js');
const bot = require('./modules/main.js')(Client);
const client = new bot(require('./config.js').options);

client.login(process.env.token).catch(e => console.log(e));