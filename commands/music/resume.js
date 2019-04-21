
module.exports.run = async (client, message, args) => {
if (!message.member.voice.channel) return message.reply('You are not in a voice channel!');
   let guildq = global.guilds[message.guild.id];
      if (!guildq) guildq = client.defaultQueue;
      if(!guildq.queue[0]) return message.reply('There is no music playing right now');
      guildq.isPlaying = true;
			guildq.dispatcher.resume();
			return message.channel.send('▶ Resumed the music for you!');
};

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'resume',
  description: 'Evaluates a JS code.',
  group: 'music',
  usage: 'resume [command]'
}
