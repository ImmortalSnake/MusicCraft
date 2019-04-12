module.exports.run = async (client, message, args) => {
if (!message.member.voice.channel) return message.reply('You are not in a voice channel!');
   let guildq = global.guilds[message.guild.id];
      if (!guildq) guildq = client.defaultQueue;
      if(!guildq.queue[0]) return message.reply('There is no music playing right now');
      guildq.isPlaying = true;
      let sq = guildq.queue[0]
      sq.seek = args[0]; 
      global.guilds[message.guild.id].queue.splice(1, 0, sq);
      global.guilds[message.guild.id].dispatcher.end();
			return message.channel.send(':fast_forward: Setting position to ' + args);
  }

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'seek',
  description: 'Evaluates a JS code.',
  group: 'music',
  usage: 'seek [command]'
}