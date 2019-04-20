const db = require('quick.db');
const discord = require('discord.js');

exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have any materials .Use the `s!start` command to get a pickaxe')
  if(!args[0]) return message.channel.send('Correct format is s!craft [tool]')
  let t = args.join(' ').toProperCase()
  let tool = ok(t, client)
  if(!tool) return message.channel.send('That tool is not craftable right now!')
  inventory = await client.checkInventory(message.author)
  if(!check(inventory, tool)) return message.channel.send('You do not have enough materials')
  let embed = client.embed(message).setTitle('Craft')
  switch(tool.type) {

    case 'Armor': {
    if(inventory.armor[t]) return message.channel.send('You already own this tool');
    for(const mat in client.tools.Armor[t].materials) {
    inventory.materials[mat.toProperCase()] -= client.tools.Armor[t].materials[mat]
    }
   inventory.armor[t] = { durability : tool.durability, enchant: ''}
    embed.setDescription(`Successfully crafted a ${t} ${tool.emote}.
Use \`s!equip ${t}\` to equip it!`)
   await db.set(`inventory_${message.author.id}`, inventory)
  message.channel.send(embed)
    return;
    break;
    }
    case 'Other': {
      for(const mat in tool.materials) {
       inventory.materials[mat.toProperCase()] -= tool.materials[mat]
      }
      for(const oth in tool.other) {
       inventory.other[oth.toProperCase()] -= tool.other[oth]
       }
      if(tool.onetime){
        if(inventory.other[t]) return message.channel.send(`You already have a ${t}`)
        inventory.other[t] = {} 
      } else {
        inventory.other[t] ? inventory.other[t]++ : inventory.other[t] = 1
      }
      embed.setDescription(`Successfully crafted a ${t} ${tool.emote}`)
      message.channel.send(embed)
      await db.set(`inventory_${message.author.id}`, inventory)
      return;
      break;
    }
    case 'Normal': {
      generate(inventory, tool, t, message);
      return;
      break;
    }
  }
}
function check(inventory, tool) {
  for(const mat in tool.materials) {
    if(tool.materials[mat] > inventory.materials[mat.toProperCase()]) return false
  }
  if(tool.other) {
  for(const oth in tool.other) {
    if(tool.other[oth] > inventory.other[oth.toProperCase()] || !inventory.other[oth.toProperCase()]) return false
   }
  }
  return true;
}

function ok(tool, client) {
  for(const t in client.tools.Tools) {
    let x = client.tools.Tools[tool.toProperCase()]
    if(x) return x
  }
  for(const t in client.tools.Armor) {
    let x = client.tools.Armor[tool.toProperCase()]
    if(x) return x
  }
  if(client.tools.Other[tool.toProperCase()]) return client.tools.Other[tool.toProperCase()]
  return false
}

async function generate(inventory, tool, name, message) {
  if(inventory.tools[name]) return message.channel.send('You already own this tool')
  for(const mat in tool.materials) {
    inventory.materials[mat.toProperCase()] -= tool.materials[mat]
  }
  // (inventory.tools[name]) ? inventory.tools[name]++ : inventory.tools[name] = 1;
  inventory.tools[name] = { durability : tool.durability, enchant: ''}
  await db.set(`inventory_${message.author.id}`, inventory)
  let embed = message.client.embed(message)
  .setTitle('Craft')
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