const commando = require('discord.js-commando');
const discord = require('discord.js');
const config = process.env
const request = require("request");

module.exports = class PlayMusicCommand extends commando.Command { // important
    constructor(client) { // important
        super(client, { // important
            name: 'soundcloud', // no caps no spaces. this is the command name
            group: 'music', // the group name the command is in
            memberName: 'soundcloud', // should be same as the name
            description: 'Play\'s a music.', // change this the '\' allows you to put a '
            guildOnly: true,
            format: '[music]'
        });
    }

    async run(message, args) {
      try{ // comes with the catch
    const guilds = global.guilds;
    const { member, content } = message;
    const bot = message.client
    const mess = content.toLowerCase();
    if (!message.guild.me.hasPermission('CONNECT')) return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		if (!message.guild.me.hasPermission('SPEAK')) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
    if (!guilds[message.guild.id]) guilds[message.guild.id] = message.client.utils.defaultQueue;
    if(guilds[message.guild.id].isPlaying && guilds[message.guild.id].voiceChannel !== message.member.voiceChannel) return message.channel.send('Currently playing something in another voice channel');
    if (member.voiceChannel || guilds[message.guild.id].voiceChannel != null) {
      let videos = args;
      if( videos.indexOf("soundcloud.com") > -1) {
			request("http://api.soundcloud.com/resolve.json?url=" + videos + "&client_id=71dfa98f05fa01cb3ded3265b9672aaf", function (error, response, body) {
				if(error) console.log(error)
				else if (response.statusCode == 200) {
				  	body = JSON.parse( body );
				  	if(body.tracks) message.channel.send("More than 1 song was found. Please use !playlist to queue these songs.");
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
            message.client.functions.playMusic(body.id, message, 0, true)
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
       request("http://api.soundcloud.com/tracks?q="+ args +"&client_id=71dfa98f05fa01cb3ded3265b9672aaf", function (error, response, body) {
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
            message.client.functions.playMusic(body[0].id, message, 0, true)
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
      catch(e) {
        console.log(e);
        message.reply('Uh oh, something went wrong please try again later');
      }
    }
};

function timeFormat(time) {
    var seconds = Math.floor(time % 60);
    var minutes = Math.floor((time - seconds) / 60);
    if(seconds < 10) seconds = "0" + seconds;
    return "[" + minutes + ":" + seconds + "]";
}