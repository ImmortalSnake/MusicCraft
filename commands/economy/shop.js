const db = require('quick.db');
const discord = require('discord.js')

exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`);
  if(!inventory) return message.channel.send('You do not have any materials .Use the `s!start` to start playing!');
  let embed = new discord.RichEmbed()
  .setColor('#206694')
  let types = client.shop.keys()
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'shop',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}