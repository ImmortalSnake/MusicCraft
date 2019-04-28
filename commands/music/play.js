const discord = require('discord.js');
const YouTube = require('simple-youtube-api');
const config = process.env;
const yt_api_key = config.yt_api_key;
const youtube = new YouTube(yt_api_key);
const request = require('request');
const getYouTubeID = require('get-youtube-id');
const fetchVideoInfo = require('youtube-info');
const db = require('quick.db');

module.exports.run = async (client, message, args) => {
  try{ // comes with the catch
    args = args.join(' ');
    if (!message.guild.me.hasPermission('CONNECT')) return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
    if (!message.guild.me.hasPermission('SPEAK')) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
    const settings = await db.fetch(`settings_${message.guild.id}`);
    let check = await client.checkMusic(message, { vc: true });
    if(check) return message.channel.send(check);
    let guildq = global.guilds[message.guild.id];

    await getID(args, async function(id) {
      if(!id) return message.channel.send('Could not obtain any search results');
      if(id === 'playlist') {
        let match = args.match(/[?&]list=([^#\&\?]+)/);
        if (match) {
          message.channel.send('Searching :mag_right: `' + args + '`'); // this gonna take time so lets give them something
          const playlist = await youtube.getPlaylistByID(match[1]);
          const videos = await playlist.getVideos();
          let t = 0;
          for (const video of Object.values(videos)) {
            if(t > 50) break;
            const video2 = await youtube.getVideoByID(video.id);
            let cqueue = {
              url: 'https://youtube.com/watch?v='+video.id,
              title: video2.title,
              id: video2.id,
              skippers: [],
              requestor: message.author.id,
              seek: 0
            }
            guildq.queue.push(cqueue);
            t++;
          }
          if(!guildq.queue.length > t || guildq.isPlaying) await message.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue! \`${t}\` songs added`);
          else{
            guildq.volume = settings.defVolume
            await client.playMusic(guildq.queue[0].id, message)
            guildq.isPlaying = true;
            await message.channel.send(`✅ Now Playing! Playlist: **${playlist.title}** has been added to the queue! \`${t}\` songs added`);
          }
        }
      } else {
        fetchVideoInfo(id, function(err, videoInfo) {
          if (err) throw new Error(err);
          const embed = new discord.MessageEmbed()
            .setThumbnail(videoInfo.thumbnailUrl)
            .setColor('BLUE')
            .setTitle('**' + videoInfo.title + '**')
            .setURL(videoInfo.url)
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .addField('Song Duration', [videoInfo.duration + ' s'], true)
            .setFooter(guildq.queue.length + ' song(s) in queue');

          message.channel.send(embed);
                    let cqueue = {
                      url: videoInfo.url,
                      title: videoInfo.title,
                      id: getYouTubeID(id) || id,
                      skippers: [],
                      requestor: message.author.id,
                      seek: 0
                    }
                    guildq.queue.push(cqueue);
                  if (guildq.queue.length > 1 || guildq.isPlaying) {
                    message.channel.send('✅Added to queue: **' + videoInfo.title + '**');
                  } else {
                    client.playMusic(id, message);
                    guildq.isPlaying = true;
                    message.channel.send('✅Now playing: **' + videoInfo.title + '**');
                  }
                });
             }
          });
      }
    catch(e) {
      console.log(e);
      message.reply('Uh oh, something went wrong please try again later');
  }
}

async function getID(str, cb) {
  if(isYoutube(str)) {
    if(getYouTubeID(str)) cb(getYouTubeID(str))
    else {
      cb('playlist')
    }
  }
  else {
    search_video(str, function(id) {
      cb(id)
    })
  }
}

async function search_video(query, callback) {
  await request('https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=' + encodeURIComponent(query) + '&key=' + yt_api_key, function(error, response, body) {
    const json = JSON.parse(body);
    if(!json.items[0]) {
      callback('3_-a9nVZYjk');
    } else {
      callback(json.items[0].id.videoId);
    }
  });
}

function isYoutube(str) {
  return str.toLowerCase().indexOf('youtube.com') > -1;
}

exports.conf = {
  aliases: ['p'],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'play',
  description: 'Plays a song from youtube with the given query or url, Supports youtube playlists',
  group: 'music',
  usage: 'play [query / url]'
}
