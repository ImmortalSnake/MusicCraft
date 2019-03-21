const commando = require('discord.js-commando');
const Discord = require('discord.js');
const YouTube = require('simple-youtube-api');
const config = require('../../config.json');
const yt_api_key = config.yt_api_key;
const youtube = new YouTube(yt_api_key);

module.exports = class PlayMusicCommand extends commando.Command { // important
    constructor(client) { // important
        super(client, { // important
            name: 'search', // no caps no spaces. this is the command name
            group: 'music', // the group name the command is in
            memberName: 'search', // should be same as the name
            description: 'Searches and Play\'s a music.', // change this the '\' allows you to put a '
            guildOnly: true,
            fotmat: '[music]'
        });
    }

    async run(message, args) {
   let queue = global.guilds[message.guild.id];
        if (!global.guilds[message.guild.id]) global.guilds[message.guild.id] = message.client.utils.defaultQueue;
      queue = global.guilds[message.guild.id];
           const voiceChannel = message.member.voiceChannel;
	         const url = args ? args.replace(/<(.+)>/g, '$1') : ''

            if (!voiceChannel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
            if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
                const playlist = await youtube.getPlaylist(url);
                const videos = await playlist.getVideos();
                for (const video of Object.values(videos)) {
                    const video2 = await youtube.getVideoByID(video.id);
                    await handleVideo(video2, message, voiceChannel, true);
                }
                    guilds[message.guild.id].queue.push(playlist.url);
                    guilds[message.guild.id].url.push(playlist.url);
                    guilds[message.guild.id].queueNames.push(playlist.title);
                return message.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
            }
        else {
                try {
                    let video = await youtube.getVideo(url);
                }
              catch (error) {
                    try {
                        let videos = await youtube.searchVideos(url, 10);
                        let index = 0;
                        message.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Please provide a value to select one of the 🔎 results ranging from 1-10.
					`);

                            let response = await message.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
                                maxMatches: 1,
                                time: 10000, // waits for 10 seconds
                                errors: ['time'],
                            });
                      if(!response) return message.reply('No value selected')
                        const videoIndex = parseInt(response.first().content);
                        var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                    } catch (err) {
                        console.error(err);
                        return message.channel.send('🆘 I could not obtain any search results.');
                    }
                }
          if(!queue.queue[0]) {
             await message.channel.send('✅ Now playing: **' + video.title + '**');
              message.client.utils.playMusic(video.id, message);
          }
          else {
           message.reply('✅Added to queue: **' + video.title + '**');
          }
          let cqueue = {
            url: video.url,
            title: video.title,
            id: video.id,
            skippers: [],
            requestor: message.author.id,
            seek: 0
          }
          guilds[message.guild.id].queue.push(cqueue);
          guilds[message.guild.id].isPlaying = true;
        }
      }
    }
