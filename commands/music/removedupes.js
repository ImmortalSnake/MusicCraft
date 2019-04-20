const discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  if (!message.member.voice.channel) return message.reply('You are not in a voice channel!');
    let guildq = global.guilds[message.guild.id];
    if (!guildq) guildq = client.defaultQueue;
		if (!guildq.queue[0]) return message.reply('There is nothing playing.');
      let old = guildq.queue.length
      global.guilds[message.guild.id].queue = rd(guildq.queue);
      let nq = global.guilds[message.guild.id].queue.length
      message.reply(`The queue dupes has been cleared by ${message.author}. \`${old-nq}\` songs removed `);
    }


exports.conf = {
  aliases: ['rd'],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'removedupes',
  description: 'Evaluates a JS code.',
  group: 'music',
  usage: 'removedupes [command]'
}

function rd(q) {
  let nq = []
  q.forEach(e => {if(!nq.includes(e)) nq.push(e);})
  return nq;
}