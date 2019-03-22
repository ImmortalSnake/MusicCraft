const commando = require('discord.js-commando');
const discord = require('discord.js');
const yt = require('simple-youtube-api')
const moment = require('moment')
const commaNumber = require('comma-number')
const youtube = new yt(process.env.yt_api_key);

module.exports = class ClearQueueCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'channel',
            group: 'music',
            aliases: ['ytchannel', 'subs', 'youtubechannel', 'subscribers', 'subscriber'],
            memberName: 'channel',
            description: 'Clears the music queue for ya',
            guildOnly: true,
            format: '<youtube channel>'
        });
    }

    async run(message, args) {
      if(!args) return;
      message.channel.send(':mag_right: **Searching for ' + args + '**')
      let embed = new discord.RichEmbed()
      .setColor('RED')
      .setFooter('Requested by ' + message.author.username, message.author.displayAvatarURL)
      youtube.searchChannels(args, 1, { part: 'snippet' }).then(data => {
        embed.setTitle(data[0].raw.snippet.title)
        .setDescription(data[0].raw.snippet.description)
        youtube.getChannelByID(data[0].id, { part: 'statistics,snippet'} ).then(body => {
        const date = body.publishedAt;
        embed.addField('Subscriber Count', commaNumber(body.subscriberCount), true)
        .addField('Video Count', commaNumber(body.videoCount), true)
        .addField('Total Views', commaNumber(body.viewCount), true)
        .addField('Created At', moment.utc(date).format('MM/DD/YYYY h:mm A'), true)
        .setThumbnail(body.thumbnails.default.url)
        message.channel.send(embed);
        })
      })
    }
};