const commando = require('discord.js-commando');
const discord = require('discord.js');

class VolumeCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'volume',
            group: 'music',
            aliases: ['vol'],
            memberName: 'volume',
            description: 'Shows and changes current volume ',
            guildOnly: true,
            format: '[volume]'
        });
    }

    async run(message, args) {

if (!message.member.voiceChannel) return message.reply('You are not in a voice channel!');
   let guildq = global.guilds[message.guild.id];
      if (!guildq) if (!guildq) guildq = message.client.utils.defaultQueue;
      if(!guildq.queue[0]) return message.reply('There is no music playing right now');
      let vol = parseInt(args);
      if (!vol) return message.channel.send(`:loud_sound: The current volume is: **${guildq.volume}**`);
      if(vol < 0 || vol > 100) return message.channel.send(`:mute: Cannot set the volume below 0 or above 100`);
			guildq.dispatcher.setVolumeLogarithmic(vol / 5);
      guildq.volume = vol
			return message.channel.send(`:loud_sound: I set the volume to: **${vol}**`);
    }
}

module.exports = VolumeCommand;
