const discord = require('discord.js');
const moment = require('moment');
const db = require('quick.db')

module.exports.run = async (client, message, args) => {
  
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  perms: ['ADMINISTRATOR']
};

exports.help = {
  name: "twitch",
  group: "fun",
  description: "Displays all the available commands for your permission level.",
  usage: "twitch [command]"
};