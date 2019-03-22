const commando = require('discord.js-commando');
const discord = require('discord.js');
const config = process.env
const yt_api_key = config.yt_api_key;
const ytdl = require('ytdl-core');
const request = require("request");
const getYouTubeID = require("get-youtube-id");
const fetchVideoInfo = require("youtube-info");

module.exports = class PlayMusicCommand extends commando.Command { // important
    constructor(client) { // important
        super(client, { // important
            name: 'play', // no caps no spaces. this is the command name
            group: 'music', // the group name the command is in
            memberName: 'play', // should be same as the name
            description: 'Play\'s a music.', // change this the '\' allows you to put a '
            aliases: ['p'],
            guildOnly: true,
            format: '[music]'
        });
    }

    async run(message, args) {
      try{ // comes with the catch
    const guilds = global.guilds;
    const { member, content } = message;
    const mess = content.toLowerCase();
    if (!message.guild.me.hasPermission('CONNECT')) return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		if (!message.guild.me.hasPermission('SPEAK')) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
    if (!guilds[message.guild.id]) guilds[message.guild.id] = message.client.utils.defaultQueue;
    if(guilds[message.guild.id].isPlaying && guilds[message.guild.id].voiceChannel !== message.member.voiceChannel) return message.channel.send('Currently playing something in another voice channel');
    if (member.voiceChannel || guilds[message.guild.id].voiceChannel != null) {
        if (guilds[message.guild.id].queue.length > 0 || guilds[message.guild.id].isPlaying) {
            getID(args, function(id) {
           //     add_to_queue(id, message);
                fetchVideoInfo(id, function(err, videoInfo) {
                    if (err) throw new Error(err);
                    const embed = new discord.RichEmbed()
                    .setThumbnail(videoInfo.thumbnailUrl)
                    .setColor('BLUE')
                    .setTitle('**' + videoInfo.title + '**')
                    .setURL(videoInfo.url)
                    .setAuthor(message.author.username, message.author.displayAvatarURL)
                    .addField('Song Duration', [videoInfo.duration + ' s'], true)
                    .setFooter(guilds[message.guild.id].queue.length + ' song(s) in queue');
                    message.channel.send(embed);
                    let cqueue = {
                      url: videoInfo.url,
                      title: videoInfo.title,
                      id: getYouTubeID(id) || id,
                      skippers: [],
                      requestor: message.author.id,
                      seek: 0
                    }
                    guilds[message.guild.id].queue.push(cqueue);
                    message.channel.send('✅Added to queue: **' + videoInfo.title + '**');
                });
            });
        }
        else {
            getID(args, function(id) {
             message.client.functions.playMusic(id, message, 0);
                fetchVideoInfo(id, function(err, videoInfo) {
                    if (err) throw new Error(err);
                    const embed = new discord.RichEmbed()
                    .setThumbnail(videoInfo.thumbnailUrl)
                    .setColor('BLUE')
                    .setTitle('**' + videoInfo.title + '**')
                    .setURL(videoInfo.url)
                    .setAuthor(message.author.username, message.author.displayAvatarURL)
                    .addField('Song Duration', [videoInfo.duration + ' s'], true)
                    .setFooter(guilds[message.guild.id].queue.length + ' song(s) in queue');
                    message.channel.send(embed);
                    let cqueue = {
                      url: videoInfo.url,
                      title: videoInfo.title,
                      id: getYouTubeID(id) || id,
                      skippers: [],
                      requestor: message.author.id,
                      seek: 0
                    }
                    guilds[message.guild.id].queue.push(cqueue);
                    guilds[message.guild.id].isPlaying = true;
                    message.channel.send('✅Now playing: **' + videoInfo.title + '**');
                });
            });
        }
    }
     else {
        message.reply('You need to be in a voice channel!');
    }
      }
      catch(e) {
        console.log(e);
        message.reply('Uh oh, something went wrong please try again later');
      }
    }
};

function getID(str, cb) {
    if (isYoutube(str)) {
        cb(getYouTubeID(str));
    }
  else {
        search_video(str, function(id) {
            cb(id);
        });
    }
}

function search_video(query, callback) {
    request('https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=' + encodeURIComponent(query) + '&key=' + yt_api_key, function(error, response, body) {
        const json = JSON.parse(body);
        if(!json.items[0]) { callback('3_-a9nVZYjk');}
        else {
            callback(json.items[0].id.videoId);
        }
    });
}

function isYoutube(str) {
    return str.toLowerCase().indexOf('youtube.com') > -1;
}
