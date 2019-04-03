const db = require('quick.db');
const discord = require('discord.js');

exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have any materials .Use the `s!start` command to get a pickaxe')
  if(!args[0]) return message.channel.send('Correct format is s!craft [tool]')
  let t = args.join(' ').toProperCase()
  let tool = ok(t, client)
  if(!tool) return message.channel.send('That tool is not craftable right now!')
  await client.checkInventory(message.author)
  if(!check(inventory, tool)) return message.channel.send('You do not have enough materials')
  if(t == 'Chest') {
    inventory.size += client.tools.Tools['Chest'].size
    for(const mat in client.tools.Tools['Chest'].materials) {
    inventory.materials[mat.toProperCase()] -= client.tools.Tools['Chest'].materials[mat]
    }
    console.log(inventory)
    return
  }
  else if(t == 'Furnace') {
    if (inventory.other['Furnace']) return message.channel.send('You already have a furnace') 
    inventory.other['Furnace'] = {}
    for(const mat in client.tools.Tools['Furnace'].materials) {
    inventory.materials[mat.toProperCase()] -= client.tools.Tools['Furnace'].materials[mat]
    }
   await db.set(`inventory_${message.author.id}`, inventory)
    let embed = new discord.MessageEmbed()
    .setTitle('Craft')
    .setColor('#206694')
    .setFooter(message.author.username, message.author.displayAvatarURL())
    .setDescription(`Successfully crafted a Furnace ${client.tools.Tools['Furnace'].emote}.
Use \`s!cook [food]\` to start cooking!`)
  message.channel.send(embed)
    return
  }
  generate(inventory, tool, t, message)
}

function check(inventory, tool) {
  for(const mat in tool.materials) {
    if(tool.materials[mat] > inventory.materials[mat.toProperCase()]) return false
  }
  return true;
}

function ok(tool, client) {
  for(const t in client.tools.Tools) {
    let x = client.tools.Tools[tool.toProperCase()]
    if(x) return x
  }
  return false
}

async function generate(inventory, tool, name, message) {
  for(const mat in tool.materials) {
    inventory.materials[mat.toProperCase()] -= tool.materials[mat]
  }
  (inventory.tools[name]) ? inventory.tools[name]++ : inventory.tools[name] = 1;
  await db.set(`inventory_${message.author.id}`, inventory)
  let embed = new discord.MessageEmbed()
  .setTitle('Craft')
  .setColor('#206694')
  .setFooter(message.author.username, message.author.displayAvatarURL())
  .setDescription(`Successfully crafted a ${name} ${tool.emote}.
Use \`s!equip ${name}\` to equip it`)
  message.channel.send(embed)
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'craft',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'craft'
}