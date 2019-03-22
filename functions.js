const discord = require('discord.js');
const ytdl = require('ytdl-core');
const request = require("request");

const functions = {
  playMusic: async function(id, message, seek, soundcloud) {
try{
  if(!parseInt(seek)) seek = 0
  console.log(seek)
  const guildq = global.guilds[message.guild.id];
    guildq.voiceChannel = message.member.voiceChannel;
    guildq.voiceChannel.join().then(async function(connection) {
      let stream;
      if(!soundcloud) stream = await ytdl('https://www.youtube.com/watch?v=' + id, { filter: 'audioonly' });
      else stream = await request("http://api.soundcloud.com/tracks/" + id + "/stream?consumer_key=71dfa98f05fa01cb3ded3265b9672aaf");
        guildq.skippers = [];

        guildq.dispatcher = await connection.playStream(stream, {volume: guildq.volume, seek: seek});
        guildq.dispatcher.on('end', function() {
            guildq.skippers = [];
            if(guildq.looping) {
                return message.client.functions.playMusic(id, message);
            }
          else {
                guildq.queue.shift();
            }
            if (guildq.queue.length === 0) {
                guildq.queue = [];
                guildq.isPlaying = false;
                message.guild.voiceConnection.disconnect();
                message.channel.send('Music finished. Leaving the Voice Channel..');
            }
          else { // queue here
                setTimeout(function() {
                    message.client.functions.playMusic(guildq.queue[0].id, message, guildq.queue[0].seek, guildq.queue[0].soundcloud);
                }, 500);
            }
        });
    });
  } catch(err){ // risky boi
console.log(err);
}
  },

  error: async function(bot, error, message){

  },
  
getTime: function(v) {
let m = ''
if(v>=60){ 
m+= Math.floor(v/60);
v = v - m*60
}
m = m ? m : '00';
m = (m>10) ? m :(m != '00' ? '0' + m : m)
v = (v>10) ? v : ('0' + v)
m = m +':' +v;
return m;
  }
}

module.exports = functions;
