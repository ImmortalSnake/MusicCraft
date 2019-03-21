const commando = require('discord.js-commando');
const discord = require('discord.js');

module.exports = class PauseCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'pause',
            group: 'music',
            memberName: 'pause',
            description: 'Pauses the music for ya',
            guildOnly: true,
        });
    }

    async run(message, args) {
if (!message.member.voiceChannel) return message.reply('You are not in a voice channel!');
   let guildq = global.guilds[message.guild.id];
      if (!guildq) guildq = message.client.utils.defaultQueue;
      if(!guildq.queue[0]) return message.reply('There is no music playing right now');
      guildq.isPlaying = false;
			guildq.dispatcher.pause();
			return message.channel.send('⏸ Paused the music for you!');
    }
};
