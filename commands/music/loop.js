const commando = require('discord.js-commando');
const discord = require('discord.js');

class LoopCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'loop',
            group: 'music',
            memberName: 'loop',
            description: 'loops the music queue for ya',
            guildOnly: true,
        });
    }

    async run(message, args) {
    if (!message.member.voiceChannel) return message.reply('You are not in a voice channel!');
    let guildq = global.guilds[message.guild.id];
    if (!guildq) guildq = message.client.utils.defaultQueue;
		if(guildq.voiceChannel !== message.member.voiceChannel) return message.channel.send('Not in the the same voice channel');

	  	if(!guildq.looping) {
	  		guildq.looping = true;
	  		message.channel.send(':repeat: Looping `ON`');
	  	}
      else {
	  		guildq.looping = false;
	  		message.channel.send(':repeat: Looping `OFF`');
	  	}
    }
}

module.exports = LoopCommand;
