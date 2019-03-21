const commando = require('discord.js-commando');
const discord = require('discord.js');

module.exports = class ClearQueueCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'clear',
            group: 'music',
            aliases: ['cq', 'clearqueue'],
            memberName: 'clear',
            description: 'Clears the music queue for ya',
            guildOnly: true,
        });
    }

    async run(message, args) {
  if (!message.member.voiceChannel) return message.reply('You are not in a voice channel!');
    let guildq = global.guilds[message.guild.id];
    if (!guildq) guildq = message.client.utils.defaultQueue;
		if (!guildq.isPlaying) return message.reply('There is nothing playing.');
            global.guilds[message.guild.id].queue = guildq.queue.slice(0,1);
      message.reply('The queue has been cleared by ' + message.author);
    }
};
