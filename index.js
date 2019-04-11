const discord = require('discord.js');
const config = process.env
const fs = require('fs');
const bot = new discord.Client();
const moment = require('moment')
const http = require('http');
const express = require('express');
const app = express();

app.get('/', (request, response) => {
  console.log(moment(Date.now()) + ' Ping Received');
 // consoleHook.send(ms(, { long: true }) + ' Ping Received');
  response.sendStatus(200);
});
const port = app.listen(process.env.PORT);
setInterval(() => {
http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

bot.Discord = discord;
bot.commands = new discord.Collection();
bot.groups = new discord.Collection() 
bot.aliases = new discord.Collection();
bot.events = new discord.Collection();
bot.prefix = 's!'

require("./modules/functions.js")(bot)
require("./modules/utils.js")(bot)
require("./modules/handlers.js")(bot)
global.guilds = {};

fs.readdir(`./commands/`, (err, groups) => {
  if (err) throw new Error(`\n[Commands]\tThere was an error!`);
  groups.forEach(group =>{
  fs.readdir(`./commands/${group}/`, (err,files) =>{
  var jsfiles = files.filter(f => f.split(`.`).pop() == `js`);
  if (jsfiles.length == 0) throw new Error(`\n[Commands]\tNo commands to load.`);
  jsfiles.map(file => {
    var commandName = file.split(`.`)[0];
    var commandFunction = require(`./commands/${group}/${file}`);
    if(!commandFunction.help) return console.log(`${commandName} is not completed`)
    var commandname = commandFunction.help.name || commandName;
    if (!commandFunction.run) return console.log(`${commandName} has no run function.`);
    if(bot.commands.get(commandname)) throw new Error(`\n${commandname} has already been registered`)
    if(Array.from(bot.aliases.keys()).find(e => {commandFunction.conf.aliases.includes(e)})) throw new Error(`\nAn alias of ${commandname} has already been registered`)
    if(bot.aliases.has(commandName)) throw new Error(`\nAn alias with ${commandname} has already been registered`)

    bot.commands.set(commandname, commandFunction);
    commandFunction.conf.aliases.map(alias => bot.aliases.set(alias, commandname));
  });
      console.log(`[Commands]\tLoaded a total amount ${jsfiles.length} commands in ${group}`);
      bot.groups.set(group, bot.commands.filter(cmd => cmd.help.group == group))
  })
  })
});

//Event Handler
fs.readdir(`./events/`, async (err, files) => {
  if (err) return new Error(`\n[Events]\tThere was an error!`);
  const jsfiles = files.filter(f => f.split(`.`).pop() === `js`);
  if (jsfiles.length == 0) throw new Error(`\n[Events]\tNo events to load.`);
  jsfiles.map(file => {
    var eventName = file.split(`.`)[0];
    var eventFunction = require(`./events/${file}`);
    if (!eventFunction.run) throw new Error(`\n${eventName} has no run function.`);
    bot.events.set(eventName, eventFunction);
    bot.on(eventName, eventFunction.run.bind(null, bot));
  });
  console.log(`[Events]\tLoaded a total of ${jsfiles.length} events.`);
});

bot.login(config.token).catch(e => {
  console.log(e);
});

process
    .on('uncaughtException', err => console.error(err.stack))
    .on('unhandledRejection', err => console.error(err.stack));      


