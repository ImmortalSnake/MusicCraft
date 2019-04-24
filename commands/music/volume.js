module.exports.run = async (client, message, args) => {
  let check = await client.checkMusic(message, { vc: true, playing: true, djRole: true})
  if(check) return message.channel.send(check)
  let guildq = global.guilds[message.guild.id]
      let vol = parseInt(args[0]);
      if (!vol) return message.channel.send(`:loud_sound: The current volume is: **${guildq.volume}**`);
      if(vol <= 0 || vol > 50) return message.channel.send(`:mute: Cannot set the volume below 1 or above 50`);
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
  description: 'Shows or Changes the current volume!',
  group: 'music',
  usage: 'volume [volume (in numbers)]'
}
