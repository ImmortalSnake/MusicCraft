const db = require('quick.db')
const discord = require('discord.js')
exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have a player .Use the `s!start` command to get a player');
  let embed = client.embed(message)
  .setTitle('Profile')
  .addField('XP', inventory.xp + ' / ' + inventory.level * 20, true)
  .addField('Level', inventory.level, true)
  .addField('Hunger', inventory.hunger, true)
  .addField('Health', inventory.health, true)
  .addField('Attack', inventory.attack + inventory.equipped.sword ? client.tools.Tools[inventory.equipped.sword].dmg : 0, true)
  .addField('Tools', Object.keys(inventory.tools).length, true)

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
  description: 'Displays your current stats',
  group: 'economy',
  usage: 'profile'
}