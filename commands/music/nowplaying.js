const discord = require('discord.js');
const fetchVideoInfo = require('youtube-info');
const ms = require('ms')
const request = require("request");

module.exports.run = async (client, message, args) => {
  let check = await client.checkMusic(message, { playing: true })
  if(check) return message.channel.send(check)
  let guildq = global.guilds[message.guild.id]
  const mess = client.embed(message)
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


exports.help = {
  name: 'nowplaying',
  description: 'Displays some information about the current playing music',
  group: 'music',
  usage: 'np [command]'
}
