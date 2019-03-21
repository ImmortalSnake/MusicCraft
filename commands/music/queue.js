const commando = require('discord.js-commando');
const discord = require('discord.js');
const getYouTubeID = require('get-youtube-id');
const fetchVideoInfo = require('youtube-info');

class MusicQueueCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'queue',
            group: 'music',
            memberName: 'queue',
            aliases: ['q'],
            description: 'shows the current queue for playing music!',
            guildOnly: true,
        });
    }

    async run(message, args) {
      let guildq = global.guilds[message.guild.id];
      let bot = message.client;
        if (!guildq) guildq = message.client.utils.defaultQueue;
        if(guildq.queue.length == 0) return message.channel.send('no music queue right now..');
        const mess = new discord.RichEmbed()
        .setColor('BLUE')
        .setFooter(guildq.queue.length + ' songs in queue');

      guildq.looping ? mess.setTitle('Music Queue for ' + message.guild.name + ' *LOOPING*') : mess.setTitle('Music Queue for ' + message.guild.name);
      let message2 = '';
    for (let i = 0; i < guildq.queue.length; i++) {
        const temp = `\n${(i + 1)} : [${guildq.queue[i].title}](${guildq.queue[i].url})${(i == 0 ? ' **(Current Song)**' : '')}\n~ Requested By: ${bot.users.get(guildq.queue[i].requestor)}\n`;
          message2 += temp;
        }
       mess.setDescription(message2);
       message.channel.send(mess);
    }
}


module.exports = MusicQueueCommand;
