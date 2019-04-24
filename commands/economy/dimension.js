const db = require('quick.db');
const discord = require('discord.js');

exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`);
  if(!inventory) return message.channel.send('You do not have any materials. Use the `s!start` command to start');
  let dim = args.join(' ').toLowerCase();
  let bal = await db.fetch(`balance_${message.author.id}`)
  if(!dim) return message.channel.send('Please use `s!dim [nether/overworld]`');
  let embed = new discord.MessageEmbed()
  .setTitle('Dimension')
  .setAuthor(message.author.username, message.author.displayAvatarURL())
  .setColor('#206694')
  switch(dim) {
    case 'overworld': {
      if(inventory.dimension === 'Overworld') return message.channel.send('You are already in the Overworld');
      inventory.dimension = 'Overworld';
      if(bal < 1000) return message.channel.send('You need atleast 1000 coins to go to the nether world');
      await db.subtract(`balance_${message.author.id}`, 1000)
      inventory.dimension = 'Overworld';
      await db.set(`inventory_${message.author.id}`, inventory)
      embed.setDescription(`You have teleported back to the Overworld safely!`)
      message.channel.send(embed)
      break;
    }
    case 'nether': case 'netherworld': {
      if(inventory.dimension === 'Nether') return message.channel.send('You are already in the Netherworld');
      if(!inventory.other['Nether Portal']) return message.channel.send('You need to craft a nether portal to get to the Netherworld');
      if(bal < 1000) return message.channel.send('You need atleast 1000 coins to go inside the nether portal');
      await db.subtract(`balance_${message.author.id}`, 1000)
      inventory.dimension = 'Nether';
      await db.set(`inventory_${message.author.id}`, inventory)
      embed.setDescription(`You have teleported to the Nether using a Nether Portal ${client.tools.Other['Nether Portal'].emote}!`)
      message.channel.send(embed)
      break;
    }
    default: return message.channel.send('Please use `s!dim [nether/overworld]`')
  }
}

exports.conf = {
  aliases: ['dim'],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'dimension',
  description: 'Travel to different dimensions with this command!',
  group: 'economy',
  usage: 'dimension [dimension name]'
}