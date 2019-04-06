const db = require('quick.db');
const sort = require('array-sort');
const discord = require('discord.js');

module.exports.run = async (client, message, args, color, prefix) => {
  if(!client.admins.includes(message.author.id)) return message.reply ('you are not allowed to use this command')
  let user = client.users.get(args[0]) || message.mentions.users.first()
  if(!user.id) return message.channel.send('Could not find that user')
  if(!args[1]) return message.channel.send('Correct format is `s!dbset [user] [option]`')
  switch(args[1].toLowerCase()){
    case 'invlist': {
      let inventory = await db.fetch(`inventory_${user.id}`);
        if(!inventory) return message.channel.send('That user does not have a player');
        let val = {}
        let res = {}
        let foo = {}
        let m = `**`
        let t = `**`
        let d = `**`
        for(const m in client.items.Materials) { val[m] = inventory.materials[m] || 0 }
        for(const c in inventory.tools) { res[c] = inventory.tools[c] || 0 }
        for(const f in inventory.food) { foo[f] = inventory.food[f] || 0 }
        for(const v in val) { let emote = client.items.Materials[v].emote
        m += `${v}${emote} x${val[v]}\n` }
        for(const x in res) { let emote = client.tools.Tools[x].emote
        t += `${x}${emote} x${res[x]}\n` }
        for(const f in foo) { let emote = client.items.food[f].emote
        d += `${f}${emote} x${foo[f]}\n`}
        m += `**`
        t += `**`
        d += `**`
        let embed = new discord.MessageEmbed()
          .setTitle(':fishing_pole_and_fish: Inventory')
          .setColor('GREEN')
          .setFooter(user.username, user.displayAvatarURL())
          .addField('Materials', m, true)
          .addField('Tools', t, true)
          .addField('Food', d, true)
       message.channel.send(embed)
      break;
    }
    case 'invadd': {
      if(!args[2]) return message.channel.send('Please specify an item');
      let t = args.slice(2).join(' ').split('-')[0].trim().toProperCase();
      let locate = find(client, t)
      if(!locate) return message.channel.send('Could not find that item');
      let amount = parseInt(args.join('').split('-')[1]) || 1
      let inventory = await db.fetch(`inventory_${user.id}`);
      if(!inventory) return message.channel.send('That user does not have a player');
      (inventory[locate][t]) ? inventory[locate][t]+= amount : inventory[locate][t] = amount;
      await db.set(`inventory_${user.id}`, inventory)
      message.channel.send(`Successfully added ${amount} ${t} to ${user.tag}`)
      break;
    }
    case 'invaddcrate': {
      if(!args[2]) return message.channel.send('Please specify the type of crate');
      let t = args.slice(2).join(' ').toProperCase();
      if(!client.tools.crates[t]) return message.channel.send('Could not find that crate');
      let inventory = await db.fetch(`inventory_${user.id}`);
      if(!inventory) return message.channel.send('That user does not have a player');
      inventory.crates.push(t)
      await db.set(`inventory_${user.id}`, inventory)
      message.channel.send(`Successfully added a ${t} Crate to ${user.tag}`)
      break;
    }
  }
};

function find(client, name) {
  if(client.tools.Tools[name]) return 'tools'
  if(client.items.food[name]) return 'food'
  if(client.items.Materials[name]) return 'materials'
  return false
}

exports.conf = {
  aliases: [],
};

// Name is the only necessary one.
exports.help = {
  name: 'dbset',
  description: 'Evaluates a JS code.',
  usage: 'eval',
  group: 'owner'
}