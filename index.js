const discord = require('discord.js');
const client = new discord.Client(require('./config.js').options);
require('./modules/main.js')(client);

client.login(process.env.token).catch(e => console.log(e));