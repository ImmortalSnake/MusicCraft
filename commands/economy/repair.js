const db = require('quick.db');
exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`);
  if(!inventory) return message.channel.send('You do not have any tools. Use the `s!start` command to get an axe');
  if(!args[0]) return message.channel.send('Correct format is `s!repair [tool]`');
  let t = args.join(' ').toProperCase()
  let l = locate(inventory, t);
  if(!l) return message.channel.send('Could not find that item in your inventory')
  let tool = client.tools[l.toProperCase()][t]
  console.log(tool)
  inventory[l][t].durability = tool.durability
  if(!check(inventory, tool)) return message.channel.send('You do not have enough materials')
  for(const mat in tool.repair) {
    inventory.materials[mat.toProperCase()] -= tool.repair[mat]
  }
  console.log(inventory)
}

function locate(inventory, t) {
  if(inventory.tools[t]) return 'tools';
  if(inventory.armor[t]) return 'armor';
  return false
}

function check(inventory, tool) {
  for(const mat in tool.repair) {
    if(tool.repair[mat] > inventory.materials[mat.toProperCase()]) return false
  }
  if(tool.other) {
  for(const oth in tool.other) {
    if(tool.other[oth] > inventory.other[oth.toProperCase()] || !inventory.other[oth.toProperCase()]) return false
   }
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
  name: 'repair',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}