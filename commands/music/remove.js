const discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  if(!parseInt(args)) return message.client.utils.formatError(this, message);
  if (!message.member.voice.channel) return message.reply('You are not in a voice channel!');
   let guildq = global.guilds[message.guild.id];
      if (!guildq) guildq = message.client.utils.defaultQueue;
      if(!guildq.queue[0]) return message.reply('There is no music playing right now');
      if(!guildq.queue[args - 1]) return message.reply('Could not find a music in that id');
      global.guilds[message.guild.id].queue.splice(0, args - 1);
			return message.channel.send('▶ Removed the music for you!');
  }


exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'remove',
  description: 'Evaluates a JS code.',
  group: 'music',
  usage: 'remove [command]'
}