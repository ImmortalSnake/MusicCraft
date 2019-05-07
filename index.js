const discord = require('discord.js');
const client = new discord.Client();
process.env = require('./env.js');
require('./modules/main.js')(client);

client.login(process.env.token).catch(e => console.log(e));