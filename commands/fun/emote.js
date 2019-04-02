
const Discord = require("discord.js");

module.exports.run = (client, message, args) =>{
  let name = client.tools.Pickaxe['Wooden Pickaxe'].emote
  let emoji = client.emojis.find(e=>e.name===name)
  if(!emoji) return message.channel.send('naw')
  message.channel.send('<:'+name+':' + emoji.id + '> yeet')
}

module.exports.help = {
  name: "emote",
  description: 'Evaluates a JS code.',
  group: 'fun',
  usage: 'time [command]'
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};