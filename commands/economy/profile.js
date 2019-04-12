const db = require('quick.db')
const discord = require('discord.js')
exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have a player .Use the `s!start` command to get a player');
  let embed = new discord.MessageEmbed()
  .setTitle('Profile')
  .setColor('#206694')
  .addField('XP', inventory.xp + ' / ' + inventory.level * 20, true)
  .addField('Level', inventory.level, true)
  .addField('Hunger', inventory.hunger, true)
  .addField('Health', inventory.health, true)
  .addField('Attack', inventory.attack + client.tools.Tools[inventory.equipped.sword].dmg, true)
  .addField('Tools', Object.keys(inventory.tools).length, true)
  
  .setFooter(message.author.username, message.author.displayAvatarURL())
  message.channel.send(embed)
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'profile',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}