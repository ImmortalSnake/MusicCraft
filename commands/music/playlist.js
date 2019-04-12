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
            let match = args.match(/[?&]list=([^#\&\?]+)/);
            if (match) {
              message.channel.send('Searching :mag_right: `' + args + '`') // this gonna take time so lets give them something
                let playing = queue.queue[0] ? true : false
                const playlist = await youtube.getPlaylistByID(match[1]);
                const videos = await playlist.getVideos();
                let t = 0;
                for (const video of Object.values(videos)) {
                  if(t > 50) break;
                    const video2 = await youtube.getVideoByID(video.id)
                    let cqueue = {
                    url: 'https://youtube.com/watch?v='+video.id,
                    title: video2.title,
                    id: video2.id,
                    skippers: [],
                    requestor: message.author.id,
                    seek: 0
                    }
                    global.guilds[message.guild.id].queue.push(cqueue);
                    t++;
                }
              if(!playing) {
             await message.client.functions.playMusic(global.guilds[message.guild.id].queue[0].id, message)
            global.guilds[message.guild.id].isPlaying = true;
             await message.channel.send(`✅ Now Playing! Playlist: **${playlist.title}** has been added to the queue! \`${t}\` songs added`);
              }else{
            global.guilds[message.guild.id].isPlaying = true;
            await message.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue! \`${t}\` songs added`);
            }
            }
    else{
    return message.channel.send('Could not find the playlist');
    }
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
  name: 'playlist',
  description: 'Evaluates a JS code.',
  group: 'music',
  usage: 'playlist [command]'
}