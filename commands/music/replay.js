const commando = require('discord.js-commando');

module.exports = class ResumeCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'replay',
            group: 'music',
            memberName: 'replay',
            description: 'Resumes music when paused',
            guildOnly: true,
        });
    }

    async run(message, args) {
if (!message.member.voiceChannel) return message.reply('You are not in a voice channel!');
   let guildq = global.guilds[message.guild.id];
      if (!guildq) guildq = message.client.utils.defaultQueue;
      if(!guildq.queue[0]) return message.reply('There is no music playing right now');
      guildq.isPlaying = true;
      global.guilds[message.guild.id].queue.splice(1, 0, guildq.queue[0]);
      global.guilds[message.guild.id].dispatcher.end();
			return message.channel.send('▶ Resumed the music for you!');
    }
};
