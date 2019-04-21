const discord = require('discord.js');
const config = process.env
const request = require("request");

exports.run = async (client, message, args) => {
   // comes with the catch
    const { member, content } = message;
    const mess = content.toLowerCase();
    if(!args[0]) return message.channel.send('ello')
    if (!message.guild.me.hasPermission('CONNECT')) return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		if (!message.guild.me.hasPermission('SPEAK')) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
  if(!member.voice.channel) return message.channel.send('You are not in any voice channel. Join one to use this command')
  if (!guilds[message.guild.id]) guilds[message.guild.id] = client.defaultQueue;
    if(guilds[message.guild.id].isPlaying && guilds[message.guild.id].voiceChannel !== message.member.voice.channel) return message.channel.send('Currently playing something in another voice channel');
    if (member.voice.channel || guilds[message.guild.id].voiceChannel != null) {
      let videos = args.join(' ');
      if( videos.indexOf("soundcloud.com") > -1) {
			request("http://api.soundcloud.com/resolve.json?url=" + videos + "&client_id=71dfa98f05fa01cb3ded3265b9672aaf", function (error, response, body) {
				if(error) console.log(error)
				else if (response.statusCode == 200) {
				  	body = JSON.parse(body);
            console.log(body)
				  	if(body.tracks) {
              message.channel.send("More than 1 song was found. Please use !playlist to queue these songs.");
              let cqueue = {
                url: body.permalink_url,
                title: body.title,
                id: body.id,
                skippers: [],
                requestor: message.author.id,
                seek: 0,
                soundcloud: true
              }
            }
				  	else {
            let cqueue = {
                url: body.permalink_url,
                title: body.title,
                id: body.id,
                skippers: [],
                requestor: message.author.id,
                seek: 0,
                soundcloud: true
            }
            if(!guilds[message.guild.id].queue[0]) {
            client.playMusic(body.id, message, true)
            message.channel.send('✅Now playing: **' + body.title + '**');
            } else {
              message.channel.send('✅Added to queue: **' + body.title + '**');
            }
            guilds[message.guild.id].queue.push(cqueue);
            guilds[message.guild.id].isPlaying = true;
					}
				}
				else message.channel.send("Error: " + response.statusCode + " - " + response.statusMessage);
				// queueSongs(bot, msg, videos);
			});
			return; 
      }
     else {
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
            if(!guilds[message.guild.id].queue[0]) {
            client.playMusic(body[0].id, message, true)
            message.channel.send('✅Now playing: **' + body[0].title + '**');
            } else {
              message.channel.send('✅Added to queue: **' + body[0].title + '**');
            }
            guilds[message.guild.id].queue.push(cqueue);
            guilds[message.guild.id].isPlaying = true;
       })
     }
    }
}

function timeFormat(time) {
    var seconds = Math.floor(time % 60);
    var minutes = Math.floor((time - seconds) / 60);
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
  description: 'Evaluates a JS code.',
  group: 'music',
  usage: 'soundcloud [command]'
}