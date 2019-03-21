const discord = require('discord.js');
const ytdl = require('ytdl-core-discord');

const functions = {
  playMusic: async function(id, message, seek) {
  if(!seek) seek = 0
  const guildq = global.guilds[message.guild.id];
    guildq.voiceChannel = message.member.voiceChannel;
    guildq.voiceChannel.join().then(async function(connection) {
       const stream = await ytdl('https://www.youtube.com/watch?v=' + id, { filter: 'audioonly' });
        guildq.skippers = [];

        guildq.dispatcher = connection.playOpusStream(stream, {seek : seek});
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
                    message.client.functions.playMusic(guildq.queue[0].id, message, 0);
                }, 500);
            }
        });
    });
  },

  error: async function(bot, error, message){

  }
}

module.exports = functions;
