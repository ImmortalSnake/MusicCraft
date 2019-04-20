const db = require('quick.db')
const discord = require('discord.js')
exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have any materials .Use the `s!start` command to cook')
  if(!inventory.other.Furnace) return message.channel.send('You do not have a furnace. Use `s!craft furnace` to craft one')
  let c = args.join(' ').toProperCase()
  if(!c) return message.channel.send('What would you like to cook')
  let food = client.items.recipes[c]
  if(!food) return message.channel.send('You cant cook that now')
  if(!check(inventory, food)) return message.channel.send('You do not have enough materials')
  for(const mat in food.materials) {
    inventory.materials[mat.toProperCase()] ? inventory.materials[mat.toProperCase()] -= food.materials[mat] : inventory.food[mat.toProperCase()] -= food.materials[mat]
  }
  inventory.food[c] ? inventory.food[c]++ : inventory.food[c] = 1
  let embed = client.embed(message, { title: '**Cook**' })
  .setDescription(`Successfully cooked a ${c} ${client.items.Food[c].emote}.
Use \`s!eat ${c}\` to eat it`)
  await db.set(`inventory_${message.author.id}`, inventory)
  message.channel.send(embed)
}

function check(inventory, tool) {
  for(const mat in tool.materials) {
    if(inventory.materials[mat.toProperCase()] && tool.materials[mat] > inventory.materials[mat.toProperCase()]) return false
    if(inventory.food[mat.toProperCase()] && tool.materials[mat] > inventory.food[mat.toProperCase()]) return false
  }
  return true;
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'cook',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}