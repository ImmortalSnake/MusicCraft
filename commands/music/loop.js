const discord = require('discord.js');
module.exports.run = async (client, message, args) => {
    if (!message.member.voice.channel) return message.reply('You are not in a voice channel!');
    let guildq = global.guilds[message.guild.id];
    if (!guildq) guildq = client.defaultQueue;
		if(guildq.voiceChannel !== message.member.voice.channel) return message.channel.send('Not in the the same voice channel');

	  	if(!guildq.looping) {
	  		guildq.looping = true;
	  		message.channel.send(':repeat: Looping `ON`');
	  	}
      else {
	  		guildq.looping = false;
	  		message.channel.send(':repeat: Looping `OFF`');
	  	}
    }

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'loop',
  description: 'Evaluates a JS code.',
  group: 'music',
  usage: 'loop [command]'
}
