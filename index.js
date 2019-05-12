const discord = require('discord.js');
const client = new discord.Client({
  disableEveryone: true,
  messageCacheLifetime: 3600,
  messageSweepInterval: 3600,
  autoReconnect: true
});
require('./modules/main.js')(client);

client.login(process.env.token).catch(e => console.log(e));