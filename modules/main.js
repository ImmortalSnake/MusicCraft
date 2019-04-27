const discord = require('discord.js');

module.exports = (client) => {
  client.Discord = discord;
  client.commands = new discord.Collection();
  client.groups = new discord.Collection();
  client.aliases = new discord.Collection();
  client.events = new discord.Collection();
  client.prefix = 's!';
  client.version = '0.9.0 Stable';

  require('./functions.js')(client);
  require('./utils.js')(client);
  require('./handlers.js')(client);
  global.guilds = {};

  require('../handlers/commands.js')(client);
  require('../handlers/events.js')(client);
};