module.exports.run = async (client, message, args) => {
args = args[0]
if (!message.member.voice.channel) return message.reply('You are not in a voice channel!');
   let guildq = global.guilds[message.guild.id];
      if (!guildq) if (!guildq) guildq = client.defaultQueue;
      if(!guildq.queue[0]) return message.reply('There is no music playing right now');
      let vol = parseInt(args);
      if (!vol) return message.channel.send(`:loud_sound: The current volume is: **${guildq.volume}**`);
      if(vol < 0 || vol > 100) return message.channel.send(`:mute: Cannot set the volume below 0 or above 100`);
			guildq.dispatcher.setVolumeLogarithmic(vol / 5);
      guildq.volume = vol;
			return message.channel.send(`:loud_sound: I set the volume to: **${vol}**`);
    }

exports.conf = {
  aliases: ['vol'],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'volume',
  description: 'Evaluates a JS code.',
  group: 'music',
  usage: 'volume [command]'
}
