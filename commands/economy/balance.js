const discord = require('discord.js');
const moment = require('moment');
const db = require('quick.db')

module.exports.run = async (client, message, args) => {
  let user = message.mentions.users.first() || message.author
  let balance = await db.fetch(`balance_${user.id}`) || client.utils.defaultBal;
  let bank = await db.fetch(`bank_${user.id}`) || 0;
  let embed = new discord.MessageEmbed()
  .setFooter(user.username,user.displayAvatarURL())
  .setColor('GREEN')
  .addField('Cash', balance, true)
  .addField('Bank', bank, true)
  
  message.channel.send(embed);
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['bal'],
  perms: []
};

exports.help = {
  name: "balance",
  group: "economy",
  description: "Displays all the available commands for your permission level.",
  usage: "twitch [command]"
};