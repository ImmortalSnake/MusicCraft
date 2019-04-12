
const discord = require('discord.js');
const yt = require('simple-youtube-api')
const moment = require('moment')
const commaNumber = require('comma-number')
const youtube = new yt(process.env.yt_api_key);

module.exports.run = async (client, message, args) => {
  args = args.join(' ');
      if(!args) return;
      message.channel.send(':mag_right: **Searching for ' + args + '**')
      let embed = new discord.MessageEmbed()
      .setColor('RED')
      .setFooter('Requested by ' + message.author.username, message.author.displayAvatarURL)
      
      youtube.searchChannels(args, 1, { part: 'snippet' }).then(data => {
      if(!data[0]) return message.channel.send('Sorry, could not find that channel')
        embed.setTitle(data[0].raw.snippet.title)
        .setDescription(data[0].raw.snippet.description)
        youtube.getChannelByID(data[0].id, { part: 'statistics,snippet'} ).then(body => {
        const date = body.publishedAt;
        embed.addField('Subscriber Count', commaNumber(body.subscriberCount), true)
        .addField('Video Count', commaNumber(body.videoCount), true)
        .addField('Total Views', commaNumber(body.viewCount), true)
        .addField('Created At', moment.utc(date).format('MM/DD/YYYY h:mm A'), true)
        .setThumbnail(body.thumbnails.default.url)
        .setURL('https://www.youtube.com/channel/'+body.id)
        message.channel.send(embed);
        })
      })
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['ytchannel', 'subs', 'youtubechannel', 'subscribers', 'subscriber'],
  permLevel: "User"
};

exports.help = {
  name: "channel",
  group: "fun",
  description: "Displays all the available commands for your permission level.",
  usage: "channel [command]"
};