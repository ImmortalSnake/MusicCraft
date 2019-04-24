const db = require('quick.db');

exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`);
  if(!inventory) return message.channel.send('You do not have a profile .Use the `s!start` command to start playing');
  if(!args[0]) return message.channel.send('The correct format is `s!recipe [item]`');
  let t = args.join(' ').toProperCase();
  let tool = find(client, t);
  if(!tool) return message.channel.send('Could not find that tool');
  if(!tool.materials) return message.channel.send('That item is not craftable right now');
  let emo = tool.emote || client.items.Food[t].emote;
  let s = '';
  if(tool.durability) s += `**Durability** ${tool.durability}\n`;
  if(tool.dmg) s += `**Damage** ${tool.dmg}\n`;
  if(tool.speed) s += `**Speed** ${tool.speed}\n`;
  if(tool.energy) s += `**Energy** ${tool.energy}\n`;
  if(tool.critical) s += `**Critical Damage** ${tool.critical}\n`;
  if(tool.health) s += `**Health** ${tool.health}\n`;
  let embed = client.embed(message)
    .setDescription(`**${t} ${emo} Stats\n**`)
    .addField('**Materials Required**',  gen(client, tool, 'materials'), true)
    .addField('**Stats**', s, true);
  if(tool.repair) embed.addField('**Repair**', gen(client, tool, 'repair'), true);
  if(tool.drops) {
    let x = '**';
    if(Array.isArray(tool.drops)) x += `Wood ${client.items.Materials.Wood.emote} ${tool.drops[0]} - ${tool.drops[1] + tool.drops[0] - 1}`;
    else {
      let foo = {};
      for(const oth in tool.drops) {
        foo[oth] = tool.drops[oth];
      }
      for(const t in foo) {
        let e = client.items.Materials[t.toProperCase()] || client.items.Food[t.toProperCase()] || client.items.Other[t.toProperCase()];
        x += `${t.toProperCase()} ${e.emote} ${foo[t][0]} - ${foo[t][1]} | ${foo[t][2] * 100 || 100}%\n`;
      }
    }
    x += '**';
    embed.addField('**Drops**', x, true);
  }
  return message.channel.send(embed);
};

function find(client, name) {
  if(client.tools.Tools[name]) return client.tools.Tools[name];
  if(client.tools.Other[name]) return client.tools.Other[name];
  if(client.tools.Armor[name]) return client.tools.Armor[name];
  if(client.items.recipes[name]) return client.items.recipes[name];

  return false;
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

exports.help = {
  name: 'stats',
  description: 'View all details of any food, armor, tool',
  group: 'economy',
  usage: 'stats [item]'
}

function gen(client, tool, type) {
  let r = `**`
  let foo = {}
  for(const oth in tool[type]) {
    foo[oth] = tool[type][oth]
  }
  for(const t in foo) {
    let e = client.items.Materials[t.toProperCase()] || client.items.Food[t.toProperCase()] || client.items.Other[t.toProperCase()]
    r += `${t.toProperCase()} ${e.emote} x${foo[t]}\n`
  }
  r += `**`
  return r;
}