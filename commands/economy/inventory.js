const db = require('quick.db')
const discord = require('discord.js')
exports.run = async (client, message, args) => {
  let inventory = db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have a player .Use the `s!start` command to get a player');
  
  let embed = new discord.MessageEmbed()
  .setTitle('Inventory')
  .setColor('GREEN')
  .setFooter(message.author.username, message.author.displayAvatarURL())
  .addField('Materials', getinv(inventory, 'Materials', client), true)
  .addField('Tools', getinv(inventory, 'Tools', client), true)
  .addField('Food', getinv(inventory, 'Food', client), true)
  .addField('Armor', getinv(inventory, 'Armor', client), true)
  .addField('Other', getinv(inventory, 'Other', client), true)
  message.channel.send(embed)
}

function getinv(inventory, type, client) {
  let res = {}
  let m = `**`
  for(const mat in inventory[type.toLowerCase()]) {
    res[mat] = inventory[type.toLowerCase()][mat] || 0
    if(typeof res[mat] === 'object') res[mat] = 1
  }
  for(const v in res) {
    let e;
    if(client.items[type]) e = client.items[type][v] ;
    else if(client.tools[type]) e = client.tools[type][v];
    if(!e) e = { emote: ''  };
    m += `${v}${e.emote} x${res[v]}\n`;
  }
  m += `**`;
  return m;
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