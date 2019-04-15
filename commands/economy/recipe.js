const db = require('quick.db');
const discord = require('discord.js')

exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have a profile .Use the `s!start` command to start playing');
  if(!args[0]) return message.channel.send('The correct format is `s!recipe [item]`')
  let t = args.join(' ').toProperCase()
  let tool = find(client, t)
  if(!tool) return message.channel.send('Could not find that tool')
  if(!tool.materials ) return message.channel.send('That item is not craftable right now')
  let emo = tool.emote || client.items.Food[t].emote
  let res = {}
  let m = `Recipe for ${t} ${emo}\n**`
  for(const mat in tool.materials) {
    res[mat] = tool.materials[mat]
  }
  if(tool.other){
  for(const oth in tool.other) {
    res[oth] = tool.other[oth]
  }
  }
  for(const t in res) {
    let e = client.items.Materials[t.toProperCase()] || client.items.Food[t.toProperCase()] || client.items.Other[t.toProperCase()]
    m += `${t} ${e.emote} x${res[t]}\n`
  }
  m += `**`
  let embed = client.embed(message)
  .setTitle(`Recipe`)
  .setDescription(m)
  message.channel.send(embed)
}

function find(client, name) {
  if(client.tools.Tools[name]) return client.tools.Tools[name]
  if(client.tools.Other[name]) return client.tools.Other[name]
  if(client.tools.Armor[name]) return client.tools.Armor[name]
  if(client.items.recipes[name]) return client.items.recipes[name]
  return false
}
exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'recipe',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}