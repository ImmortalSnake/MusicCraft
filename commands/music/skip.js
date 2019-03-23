const commando = require('discord.js-commando');

class SkipMusicCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'skip',
            group: 'music',
            memberName: 'skip',
            description: 'skips the current playing music!',
            guildOnly: true,
        });
    }

    async run(message, args) {
 if (!message.member.voiceChannel) return message.reply('You are not in a voice channel!');
   let guildq = global.guilds[message.guild.id];
   if (!guildq) guildq = message.client.utils.defaultQueue;
      if(!guildq.queue[0]) return message.reply('There is no music playing right now');
        if (guildq.skippers.indexOf(message.author.id) == -1) {
            guildq.skippers.push(message.author.id);
            if (guildq.skippers.length >= Math.ceil((guildq.voiceChannel.members.size - 1) / 2)) {
                guildq.dispatcher.end();
                return message.reply('✅your skip has been acknowledged. Skipping now!');
            }
          else {
            message.reply(' your skip has been acknowledged. You need **' + (Math.ceil((guildq.voiceChannel.members.size - 1) / 2) - guildq.skippers.length) + '**  more skip votes!');
          }
        }
      else {
            message.reply(' you already voted to skip!');
        }
    }
}

module.exports = SkipMusicCommand;
