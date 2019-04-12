const db = require('quick.db')
const discord = require('discord.js');
const ms = require('ms')

exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have a player .Use the `s!start` command to get a player');
  let villager = await db.fetch('villager');
  const em = client.items.Materials.Emerald.emote
  if(!args[0]) { // display store
  let m = `**`
  let res = {}
  for(const mat in villager.store) {
    res[mat] = [villager.store[mat][0], villager.store[mat][1]]
  }
  for(const t in res) {
    let e = client.items.Materials[t]
    m += `${res[t][1]} ${em} = ${res[t][0]} ${t} ${e.emote}\n`
  }
  m += `**
Use \`s!villager [item] [amount of emeralds]\` to buy an item

Trade deals reset in ${ms(villager.time + client.utils.villageTime - Date.now(), { long: true })}`
  let embed = new discord.MessageEmbed()
    .setTitle('Villager')
    .setColor('#206694')
    .setFooter(message.author.username, message.author.displayAvatarURL())
    .setDescription(m)
  message.channel.send(embed)
  }
  else {
    let item = args[0].toProperCase()
    let amount = parseInt(args[1]) || 1
    if(!villager.store[item]) return message.channel.send('The villager is not selling that item')
    if(inventory.materials['Emerald'] && inventory.materials['Emerald'] < amount) return message.channel.send('You do not have that many emeralds')
    if(villager.store[item][1] > 1 && amount % villager.store[item][1] !== 0) return message.channel.send(`You can trade only multiples of ${villager.store[item][1]} for ${item}`)
    inventory.materials['Emerald'] -= amount
    inventory.materials[item] += ((villager.store[item][1] > 1) ? amount / villager.store[item][1] : amount) * villager.store[item][0] 
    await db.set(`inventory_${message.author.id}`, inventory)
    let e = client.items.Materials[item]
    let embed = new discord.MessageEmbed()
    .setTitle('Villager')   
    .setColor('#206694')
    .setFooter(message.author.username, message.author.displayAvatarURL())
    .setDescription(`You brought ${((villager.store[item][1] > 1) ? amount / villager.store[item][1] : amount) * villager.store[item][0] } ${item} ${e.emote} for ${amount} Emeralds ${em}`)
    message.channel.send(embed)
  }
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'villager',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}