const db = require('quick.db');
const discord = require('discord.js');
const ms = require('ms');
let playing = new Set();

module.exports.run = async (client, message, args) => {  
  const amount = Math.floor(Math.random() * client.utils.work[0] + client.utils.work[1]);
  if (playing.has(`${message.author.id}`)) return message.channel.send('You can work only once in 5 seconds');
	playing.add(`${message.author.id}`);

  await db.add(`balance_${message.author.id}`, amount);
      let embed = new discord.MessageEmbed()
      .setTitle('Work')
      .setDescription('**:dollar: ' + message.author.username + ' has recieved ' + amount + ' coins by working**')
      .setColor('GREEN')
      .setFooter(message.author.username, message.author.displayAvatarURL())
     message.channel.send(embed);

    setTimeout(() => {
      playing.delete(`${message.author.id}`);
        }, client.utils.cooldown.work);
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'work',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}