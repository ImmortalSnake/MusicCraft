const db = require('quick.db')
const discord = require('discord.js')
exports.run = async (client, message, args) => {
  let inventory = db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have a player .Use the `s!start` command to get a player');
  let mats = Object.keys(client.items.Materials)
  let val = {}
  let res = {}
  let foo = {}
  let m = `**`
  let t = `**`
  let d = `**`
  //console.log(inventory)
  for(const m in client.items.Materials) {
    val[m] = inventory.materials[m] || 0
  }
  for(const c in inventory.tools) {
    res[c] = inventory.tools[c] || 0
  }
  for(const f in inventory.food) {
    foo[f] = inventory.food[f] || 0
  }
  for(const v in val) {
    let emote = client.items.Materials[v].emote
    m += `${v}${emote} x${val[v]}\n`
  }
  for(const x in res) {
    let emote = client.tools.Tools[x].emote
    t += `${x}${emote} x${res[x]}\n`
  }
  for(const f in foo) {
    let emote = client.items.food[f].emote
    d += `${f}${emote} x${foo[f]}\n`
  }
  m += `**`
  t += `**`
  d += `**`
  let embed = new discord.MessageEmbed()
  .setTitle(':fishing_pole_and_fish: Inventory')
  .setColor('GREEN')
  .setFooter(message.author.username, message.author.displayAvatarURL())
  .addField('Materials', m, true)
  .addField('Tools', t, true)
  .addField('Food', d, true)
  message.channel.send(embed)
}

exports.conf = {
  aliases: ['inv'],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'inventory',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}