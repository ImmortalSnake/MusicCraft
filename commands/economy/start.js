const db = require('quick.db')
const discord = require('discord.js')

exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`);
  if(inventory) return message.channel.send('You already have a profile.')
  let n = client.defaultInventory
  await db.set(`inventory_${message.author.id}`, n)
  let embed = new discord.MessageEmbed()
  .setColor('#206694')
  .setAuthor(message.author.username, message.author.displayAvatarURL())
  .setDescription(`Welcome ${message.author.username}!
You received your <:woodenaxe:560778791643774976>
You can now type \`s!chop\` to collect some wood`)
message.channel.send(embed)
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'start',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}