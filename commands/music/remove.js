const commando = require('discord.js-commando');
const discord = require('discord.js');

module.exports = class RemoveCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'remove',
            group: 'music',
            memberName: 'remove',
            description: 'Removes an item in the music queue',
            guildOnly: true,
            format: '<queue number>'
        });
    }

    async run(message, args) {
  if(!parseInt(args)) return message.client.utils.formatError(this, message);
  if (!message.member.voiceChannel) return message.reply('You are not in a voice channel!');
   let guildq = global.guilds[message.guild.id];
      if (!guildq) guildq = message.client.utils.defaultQueue;
      if(!guildq.queue[0]) return message.reply('There is no music playing right now');
      if(!guildq.queue[args - 1]) return message.reply('Could not find a music in that id');
      global.guilds[message.guild.id].queue.splice(0, args - 1);
			return message.channel.send('▶ Removed the music for you!');
    }
};
