const discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  if (!message.member.voice.channel) return message.reply('You are not in a voice channel!');
    let guildq = global.guilds[message.guild.id];
    if (!guildq) guildq = client.defaultQueue;
		if (!guildq.queue[0]) return message.reply('There is nothing playing.');
      global.guilds[message.guild.id].queue = guildq.queue.slice(0,1);
      message.reply('The queue has been cleared by ' + message.author);
}

exports.conf = {
  aliases: ['cq'],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'clear',
  description: 'Evaluates a JS code.',
  group: 'music',
  usage: 'clear [command]'
}

