const discord = require('discord.js');
const request = require('request');
const ms = require('ms')

exports.run = async (client, message, args) => {

  if(!message.guild.me.hasPermission('CONNECT')) return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
  if(!message.guild.me.hasPermission('SPEAK')) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');

  let check = await client.checkMusic(message, { vc: true, playing: true})
  if(check) return message.channel.send(check)
  let guildq = global.guilds[message.guild.id]
  const embed = new discord.MessageEmbed()
    .setColor('BLUE')
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setFooter(guilds[message.guild.id].queue.length + ' song(s) in queue');

  let videos = args.join(' ');
  if(videos.indexOf("soundcloud.com") > -1) {
    request("http://api.soundcloud.com/resolve.json?url=" + videos + "&client_id=71dfa98f05fa01cb3ded3265b9672aaf", function (error, response, body) {
  	if(error) console.log(error)
      else if (response.statusCode == 200) {
        body = JSON.parse(body);
        if(body.tracks){
          message.channel.send('More than 1 song was found. Please use !playlist to queue these songs');
          let cqueue = {
            url: body.permalink_url,
            title: body.title,
            id: body.id,
            skippers: [],
            requestor: message.author.id,
            seek: 0,
            soundcloud: true
          }
        } else {
          let cqueue = {
            url: body.permalink_url,
            title: body.title,
            id: body.id,
            skippers: [],
            requestor: message.author.id,
            seek: 0,
            soundcloud: true
          }
          embed.setThumbnail(body.artwork_url)
            .setTitle('**' + body.title + '**')
            .setURL(body.permalink_url)
            .addField('Song Duration', ms(body.duration + ' s'), true)
          if(!guildq.queue[0]) {
            client.playMusic(body.id, message, true)
            message.channel.send('✅Now playing: **' + body.title + '**', { embed: embed });
          } else {
            message.channel.send('✅Added to queue: **' + body.title + '**', { embed: embed });
          }
          guildq.queue.push(cqueue);
          guildq.isPlaying = true;
        }
      }
      else message.channel.send("Error: " + response.statusCode + " - " + response.statusMessage);
    });
    return;
  } else {
    request("http://api.soundcloud.com/tracks?q="+ args.join(' ') +"&client_id=71dfa98f05fa01cb3ded3265b9672aaf", function (error, response, body){
      if(error) throw new Error(error)
      body = JSON.parse(body)
      let cqueue = {
        url: body[0].permalink_url,
        title: body[0].title,
        id: body[0].id,
        skippers: [],
        requestor: message.author.id,
        seek: 0,
        soundcloud: true
      }
      embed.setThumbnail(body[0].artwork_url)
        .setTitle('**' + body[0].title + '**')
        .setURL(body[0].permalink_url)
        .addField('Song Duration', ms(body[0].duration + ' s'), true)
      if(!guildq.queue[0]) {
        client.playMusic(body[0].id, message, true)
        message.channel.send('✅Now playing: **' + body[0].title + '**', { embed: embed });
      } else {
        message.channel.send('✅Added to queue: **' + body[0].title + '**', { embed: embed });
      }
      guildq.queue.push(cqueue);
      guildq.isPlaying = true;
    })
  }
}

function timeFormat(time) {
  let seconds = Math.floor(time % 60);
  let minutes = Math.floor((time - seconds) / 60);
  if(seconds < 10) seconds = "0" + seconds;
  return "[" + minutes + ":" + seconds + "]";
}

exports.conf = {
  aliases: ['sc'],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'soundcloud',
  description: 'Plays a song from soundcloud!',
  group: 'music',
  usage: 'soundcloud [song / url]'
}