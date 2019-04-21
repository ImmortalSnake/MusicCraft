const discord = require('discord.js');
const fetchVideoInfo = require('youtube-info');
const ms = require('ms')
const request = require("request");

module.exports.run = async (client, message, args) => {
   let guildq = global.guilds[message.guild.id];
    if (!guildq) guildq = client.defaultQueue;
    if(!guildq.queue[0]) return message.reply('There is no music playing right now');
    const mess = new discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setColor('BLUE')
    .setFooter(`${guildq.queue.length} songs in queue`)
    .addField('Requested By', client.users.get(guildq.queue[0].requestor))
    fetchVideoInfo(guildq.queue[0].id, async function(err, videoInfo) {
    if (err) {
    await request("http://api.soundcloud.com/resolve.json?url=" + guildq.queue[0].url + "&client_id=71dfa98f05fa01cb3ded3265b9672aaf", async function (error, response, body) {
    if(error) throw new Error(error)
    body = JSON.parse( body );
        mess.setThumbnail(body.artwork_url)
        .setTitle('**' + guildq.queue[0].title + '**')
        .setURL(guildq.queue[0].url)
        .addField('Song Duration', ms(body.duration) , true)
        .addField('Times Played', body.playback_count, true)
        .addField('Owner', body.user.username, true)
        return message.channel.send(mess);
    })
      } else {
        mess.setThumbnail(videoInfo.thumbnailUrl)
        .setTitle('**' + guildq.queue[0].title + '**')
        .setURL(videoInfo.url)
        .addField('Song Duration', ms(videoInfo.duration * 1000) , true)
        .addField('Views', videoInfo.views, true)
        .addField('Channel', videoInfo.owner, true)
        return message.channel.send(mess);
        }
     });
    }

exports.conf = {
  aliases: ['np'],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'nowplaying',
  description: 'Evaluates a JS code.',
  group: 'music',
  usage: 'np [command]'
}
