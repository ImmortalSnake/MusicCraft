const db = require('quick.db');
const discord = require('discord.js');

exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have any materials .Use the `s!start` command to start')
  let t = args.join(' ').toProperCase()
  if(!inventory.tools[t] && !inventory.armor[t]) return message.channel.send('You do not have that tool')
  let type = t.split(' ')[1]
  let tool = client.tools.Tools[t] || client.tools.Armor[t]
  let oldt = inventory.equipped[type.toLowerCase()]
  if(inventory.equipped[type.toLowerCase()] && client.tools.Armor[oldt] && client.tools.Armor[oldt].health) inventory.health -= client.tools.Armor[oldt].health
  inventory.equipped[type.toLowerCase()] = t;
  if(tool.health) inventory.health += tool.health
  console.log(inventory)
  await db.set(`inventory_${message.author.id}`, inventory)
  let embed = new discord.MessageEmbed()
  .setTitle('Equip')
  .setColor('#206694')
  .setFooter(message.author.username, message.author.displayAvatarURL())
  .setDescription(`Successfully equipped a ${t} ${tool.emote}`)
  message.channel.send(embed)
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'equip',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'craft'
}

/*exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have any materials .Use the `s!start` command to start')
  switch(args[0].toLowerCase()){
    case 'pickaxe': {
      craft(client, 'Pickaxe', args[1], message)
      break;
    }
    case 'axe': {
      craft(client, 'Axe', args[1], message)
      break;
    }
    case 'sword': {
      break;
    }
    case 'fishingrod': {
      break
    }
  }
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'equip',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'craft'
}

async function craft(client, item, material, message) {
 let inventory = await db.fetch(`inventory_${message.author.id}`)
  switch(material.toLowerCase()) {
    case 'wood': case 'wooden': {
      let toolName = getTool(client, item , 'Wooden');
      let tool = inventory.tools[toolName]
      if(!tool) return message.channel.send('You do not have that tool')
      if(inventory.equipped[item] === toolName) return message.channel.send('You already equipped that tool')
      generate(inventory, item, toolName, message, client)
      break;
    }    
    case 'stone': {
      let toolName = getTool(client, item , 'Stone');
      let tool = inventory.tools[toolName]
      if(!tool) return message.channel.send('You do not have that tool')
      if(inventory.equipped[item] === toolName) return message.channel.send('You already equipped that tool')
      generate(inventory, item, toolName, message, client)
      break;
    }
    case 'iron': {
      let toolName = getTool(client, item , 'Iron');
      let tool = inventory.tools[toolName]
      if(!tool) return message.channel.send('You do not have that tool')
      if(inventory.equipped[item] === toolName) return message.channel.send('You already equipped that tool')
      generate(inventory, item, toolName, message, client)
    }
  }
}

function getTool(client, item, material) {
  let tools = Object.keys(client.tools[item])
  let tool = tools.find(t=> t.startsWith(material))
  return tool;
}

async function generate(inventory, tool, name, message, client) {
  inventory.equipped[tool.toLowerCase()] = name;
  let emote = client.tools[tool][name].emote
  await db.set(`inventory_${message.author.id}`, inventory)
  let embed = new discord.MessageEmbed()
  .setTitle('Craft')
  .setColor('#206694')
  .setFooter(message.author.username, message.author.displayAvatarURL())
  .setDescription(`Successfully equipped a ${name} ${tool.emote}.
Use \`s!mine ${name}\` to use it`)
  message.channel.send(embed)
}*/