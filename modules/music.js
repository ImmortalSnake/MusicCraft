const db = require('quick.db');
const youtubedl = require('youtube-dl');
const ytdl = require('ytdl-core-discord');

module.exports.play = async (client, message) => {
	const settings = await db.fetch(`settings_${message.guild.id}`);
	const guildq = global.guilds[message.guild.id];
	guildq.voiceChannel = message.member.voice.channel;
	guildq.voiceChannel.join().then(async function(connection) {
		getStream(guildq, stream => {
			guildq.dispatcher = connection.play(stream.url, stream.options);
			guildq.isPlaying = true;
			if(settings.announceSongs === 'on') message.channel.send(`Now playing **${guildq.queue[0].title}**`);
			guildq.skippers = [];
			guildq.dispatcher.on('end', function() {
				guildq.skippers = [];
				if(guildq.looping) return client.music.play(client, message);
				else guildq.queue.shift();
				if (guildq.queue.length === 0) {
					guildq.queue = [];
					guildq.isPlaying = false;
					message.guild.voiceConnection.disconnect();
					message.channel.send('Music finished. Leaving the Voice Channel..');
				} else { // queue here
					setTimeout(function() {
						client.music.play(client, message);
					}, 500);
				}
			});
		});
	});
};

async function getStream(guildq, cb){
	let video = guildq.queue[0];
	if(video.type === 'youtube') {
		let stream = await ytdl(`https://www.youtube.com/watch?v=${video.id}`, { filter: 'audioonly'});
		cb({ url: stream, options: { volume: guildq.volume, bitrate: 'auto', type: 'opus' }});
	} else {
		youtubedl.getInfo(video.id, function(err, data) {
			if (err) console.log(err);
			cb({ url: data.url, options: { volume: guildq.volume, bitrate: 'auto' }});
		});
	}
}