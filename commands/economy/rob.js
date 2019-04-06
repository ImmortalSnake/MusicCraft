const db = require('quick.db');
const discord = require('discord.js');
const ms = require('ms');
let playing = new Set();

module.exports.run = async (client, message, args) => {  
  const chance = Math.floor(Math.random() * 2)
  const user = message.mentions.users.first();
  if(!user) return message.channel.send('You need to mention the user to rob')
  const authbal = await db.fetch(`balance_${message.author.id}`) || 0;
  const userbal =  await db.fetch(`balance_${user.id}`) || 0;
  if(userbal <= 0) return message.channel.send(`Looks like ${user.username} had no money for you to take`)
  let rob = Math.floor(Math.random() * client.utils.rob[0] + client.utils.rob[1]);
  if(rob > userbal) rob = userbal;

      let embed = new discord.MessageEmbed()
      .setTitle('Rob')
      .setFooter(message.author.username, message.author.displayAvatarURL())

      if(chance == 0) {
      await db.add(`balance_${message.author.id}`, rob)
      await db.subtract(`balance_${user.id}`, rob)
      embed
      .setDescription(`**:dollar: ${message.author.username} has robbed ${user.username} for ${rob}**`)
      .setColor('GREEN')
      }
      else {
      let fail = Math.floor(Math.random() * client.utils.fine[0] + client.utils.fine[1]);
      if(fail > authbal) fail = authbal
      await db.subtract(`balance_${message.author.id}`, fail)
      embed
      .setDescription(`**:dollar: ${message.author.username} was caught robbing and was fined ${rob}**`)
      .setColor('RED')
      }
     message.channel.send(embed);
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true,
  cooldown: 300000
};

// Name is the only necessary one.
exports.help = {
  name: 'rob',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}