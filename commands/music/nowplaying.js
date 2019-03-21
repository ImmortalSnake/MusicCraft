const commando = require('discord.js-commando');
const discord = require('discord.js');
const fetchVideoInfo = require('youtube-info');
const ms = require('ms')

module.exports = class NowPlayingCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'nowplaying',
            group: 'music',
            aliases: ['np'],
            memberName: 'nowplaying',
            description: 'shows current playing music!',
            guildOnly: true,
        });
    }

    async run(message, args) {
let bot = message.client
if (!message.member.voiceChannel) return message.reply('You are not in a voice channel!');
   let guildq = global.guilds[message.guild.id];
        if (!guildq) guildq = message.client.utils.defaultQueue;
      if(!guildq.queue[0]) return message.reply('There is no music playing right now');
     fetchVideoInfo(guildq.queue[0].id, function(err, videoInfo) {
    if (err) throw new Error(err);
     const mess = new discord.RichEmbed()
        .setThumbnail(videoInfo.thumbnailUrl)
        .setColor('BLUE')
        .setTitle('**' + guildq.queue[0].title + '**')
        .setURL(videoInfo.url)
        .setAuthor(message.author.username, message.author.displayAvatarURL)
        .addField('Song Duration', ms(videoInfo.duration * 1000) , true)
        .addField('Views', videoInfo.views, true)
        .addField('Channel', videoInfo.owner, true)
        .addField('Requested By', bot.users.get(guildq.queue[0].requestor))
        .setFooter(guildq.queue.length + ' songs in queue');
        message.channel.send(mess);
     });
    }
};
