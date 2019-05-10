const youtubedl = require('youtube-dl');

module.exports.run = async (client, message, args, { settings }) => {
	try{
		args = args.join(' ');
		if (!message.guild.me.hasPermission('CONNECT')) return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		if (!message.guild.me.hasPermission('SPEAK')) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
		let check = client.music.check(message, settings, { vc: true });
		if(check) return message.channel.send(check);

		let guildq = global.guilds[message.guild.id];
		guildq.volume = settings.defvolume;
		message.channel.send(`Searching :mag_right: \`${args}\``).then(async () => {
			if(!args.toLowerCase().startsWith('http')) { // basic searches
				client.music.yt.searchVideos(args, 1).then(async videos => {
					let video = videos[0];
					addtoqueue(client, video, message, { type: 'youtube'});
					if(guildq.queue.length > 1) return message.channel.send(`Added to queue **${video.title}**`);
					else {
						message.channel.send(`Now Playing **${video.title}**`);
						return await client.music.play(client, message, settings);
					}
				}).catch((err) => console.log(err));
			}
			else if(args.toLowerCase().indexOf('youtube.com') > -1){ // yt links
				let match = args.match(/[?&]list=([^#\&\?]+)/);
				if(match){ // playlists
					const playlist = await client.music.yt.getPlaylistByID(match[1]);
					const videos = await playlist.getVideos();
					const vids = Object.values(videos);
					for (const video of vids) {
						const video2 = await client.music.yt.getVideoByID(video.id);
						addtoqueue(client, video2, message, { type: 'youtube' });
					}
					if(guildq.queue.length > 1) return message.channel.send(`Playlist: **${playlist.title}** has been added to the queue, **${vids.length}** songs added`);
					else {
						message.channel.send(`Playlist: **${playlist.title}** has been added to the queue, **${vids.length}** songs added\nNow Playing **${vids[0].title}**`);
						return await client.music.play(client, message, settings);
					}
				}
				else{ // normal vid
					client.music.yt.getVideo(args).then(async video => {
						addtoqueue(client, video, message, { type: 'youtube' });
						if(guildq.queue.length > 1) return message.channel.send(`Added to queue ${video.title}`);
						else {
							message.channel.send(`Now Playing ${video.title}`);
							return await client.music.play(client, message, settings);
						}
					});
				}
			}
			else{ // other sources, vimeo
				youtubedl.getInfo(args, async function(err, data) {
					if (err) return console.log(err);
					addtoqueue(client, data, message, { type: data.extractor});
					console.log(data);
					if(guildq.queue.length > 1) return message.channel.send(`Added to queue ${data.title}`);
					else {
						message.channel.send(`Now Playing ${data.title}`);
						return await client.music.play(client, message, settings);
					}
				});
			}
		});
	} catch(e) {
		console.log(e);
		return message.reply('Uh oh, something went wrong please try again later');
	}
};

async function addtoqueue(client, data, message, options){
	let guildq = global.guilds[message.guild.id];
	guildq.queue.push({
		skippers: [],
		requestor: message.author.id,
		url: options.type === 'youtube' ? data.url : data.webpage_url,
		title: data.title,
		seek: 0,
		type: options.type,
		id: options.type === 'youtube' ? data.id : data.url
	});
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
};
