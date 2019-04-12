const Discord = require('discord.js');
const YouTube = require('simple-youtube-api');
const config = process.env
const yt_api_key = config.yt_api_key;
const youtube = new YouTube(yt_api_key);

module.exports.run = async (client, message, args) => {
  try{
   let queue = global.guilds[message.guild.id];
      if (!global.guilds[message.guild.id]) global.guilds[message.guild.id] = message.client.utils.defaultQueue;
      queue = global.guilds[message.guild.id];
           const voiceChannel = message.member.voice.channel;
	         const url = args ? args.replace(/<(.+)>/g, '$1') : ''

            if (!voiceChannel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
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
            message.client.functions.playMusic(video.id, message);
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
          global.guilds[message.guild.id].queue.push(cqueue);
          global.guilds[message.guild.id].isPlaying = true;
      }
  catch(e) {
    console.log(e)
  }
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'search',
  description: 'Evaluates a JS code.',
  group: 'music',
  usage: 'search [command]'
}