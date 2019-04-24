const Discord = require('discord.js');
const YouTube = require('simple-youtube-api');
const config = process.env
const yt_api_key = config.yt_api_key;
const youtube = new YouTube(yt_api_key);

module.exports.run = async (client, message, args) => {
    let check = await client.checkMusic(message, { vc: true })
    if(check) return message.channel.send(check)
    let guildq = global.guilds[message.guild.id]
    
    const voiceChannel = message.member.voice.channel;
	  const url = args ? args.join(' ').replace(/<(.+)>/g, '$1') : ''

    try { var video = await youtube.getVideo(url) }
     catch (error) {
        try {
            let videos = await youtube.searchVideos(url, 10);
            let index = 0;
            let m = await message.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}

\`Please provide a value to select one of the 🔎 results ranging from 1-10\`
					`);

                      const collector = m.channel.createMessageCollector(msg2 => msg2.author.id === message.author.id && parseInt(msg2.content), { time: 10000 })
                      collector.on('collect', async  mess => {
                        const videoIndex = parseInt(mess.content);
                        if(videoIndex > 10 || videoIndex < 1) return message.channel.send('Please enter a value from 1 to 10')
                        let video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                        let cqueue = {
                          url: video.url,
                          title: video.title,
                          id: video.id,
                          skippers: [],
                          requestor: message.author.id,
                          seek: 0
                        }
                        guildq.queue.push(cqueue);
                        guildq.isPlaying = true;
                        if(!guildq.queue[1]) {
                          await message.channel.send('✅ Now playing: **' + video.title + '**');
                          client.playMusic(video.id, message);
                        } else {
                          message.reply('✅ Added to queue: **' + video.title + '**');
                        }
                      })
                      collector.on('end', res => {
                        if(!res) return message.channel.send('No value Selected')
                      })
                    } catch (err) {
                        console.error(err);
                        return message.channel.send('🆘 I could not obtain any search results.');
                    }
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
  description: 'Searches for a song in youtube with the given query and lists out 10 searches from which you can select and play music',
  group: 'music',
  usage: 'search [query]'
}