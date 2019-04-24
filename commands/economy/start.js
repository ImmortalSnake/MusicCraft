const db = require('quick.db')
const discord = require('discord.js')

exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`);
  if(inventory) return message.channel.send('You already have a profile.')
  let n = client.defaultInventory
  await db.set(`inventory_${message.author.id}`, n)
  let embed = client.embed(message)
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

exports.help = {
  name: 'start',
  description: 'Start your new minecraft adventure with this command!',
  group: 'economy',
  usage: 'start'
}