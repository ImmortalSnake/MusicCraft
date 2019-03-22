const discord = require('discord.js');
const config = process.env
const Commando = require('discord.js-commando')
const fs = require('fs');
const bot = new Commando.Client({
  commandPrefix: config.prefix,
  owner: config.owner,
  unknownCommandResponse: false,
  disableEveryone: true,
  nonCommandEditable: false
});

bot.registry.registerGroups([
  ['music', 'Music'],
  ['general', 'General'],
  ['owner', 'Owner']
]);
bot.registry.registerDefaultTypes();
bot.registry.registerCommandsIn(__dirname + '/commands');

bot.functions = require('./functions.js');
bot.utils = require('./utils.js');
global.guilds = {};

bot.on('ready', () => {
  console.log('Music Bot Has Turned On Successfuly');
})

bot.login(config.token).catch(e => {
  console.log(e);
});

process
    .on('uncaughtException', err => console.error(err.stack))
    .on('unhandledRejection', err => console.error(err.stack));
