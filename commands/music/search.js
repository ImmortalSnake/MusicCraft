exports.run = async (client, message, args, {settings}) => {
	let check = client.music.check(message, settings, { vc: true });
	if(check) return message.channel.send(check);
	let guildq = global.guilds[message.guild.id];

	const url = args ? args.join(' ').replace(/<(.+)>/g, '$1') : '';
		try {
			let videos = await client.music.yt.searchVideos(url, 10);
			let index = 0;
			let m = await message.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}

\`Please provide a value to select one of the 🔎 results ranging from 1-10\`
					`);

			const collector = m.channel.createMessageCollector(msg2 => msg2.author.id === message.author.id && parseInt(msg2.content), { time: 10000 });
			collector.on('collect', async  mess => {
				const videoIndex = parseInt(mess.content);
				if(videoIndex > 10 || videoIndex < 1) return message.channel.send('Please enter a value from 1 to 10');
				let video = await client.music.yt.getVideoByID(videos[videoIndex - 1].id);
        client.music.add(client, video, message, { type: 'youtube', url: video.url, id: video.id});
				if(!guildq.queue[1]) {
					await message.channel.send('✅ Now playing: **' + video.title + '**');
					client.music.play(client, message, settings);
				} else {
					message.reply('✅ Added to queue: **' + video.title + '**');
				}
			});
			collector.on('end', res => {
				if(!res) return message.channel.send('No value Selected');
			});
		} catch (err) {
			console.error(err);
			return message.channel.send('🆘 I could not obtain any search results.');
		}
};

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
};