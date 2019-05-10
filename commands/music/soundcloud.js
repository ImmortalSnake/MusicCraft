const request = require('request');

exports.run = async (client, message, args, {settings}) => {

	if(!message.guild.me.hasPermission('CONNECT')) return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
	if(!message.guild.me.hasPermission('SPEAK')) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');

	let check = client.music.check(message, settings, { vc: true });
	if(check) return message.channel.send(check);
	let guildq = global.guilds[message.guild.id];
	const embed = client.embed(message)
		.setFooter(guildq.queue.length + ' song(s) in queue');

	let query = args.join(' ');
	if(query.indexOf('soundcloud.com') > -1) {
		request(`http://api.soundcloud.com/resolve.json?url=${query}&client_id=${process.env.soundcloud}`, async function (error, response, body) {
			if(error) console.log(error);
			else if (response.statusCode === 200) {
				body = JSON.parse(body);
				if(body.tracks){
					let i = 0;
					for(i = 0; i < body.tracks.length; i++){
						addtoqueue(message, body.tracks[i]);
					}
					if(guildq.queue.length === i) {
						await client.music.play(client, message, settings);
						message.channel.send(`✅Now playing: **${body.tracks[0].title}**, Added ${i} songs to the queue`);
					} else {
						message.channel.send(`✅Added to ${i} songs to the queue`);
					}
				} else {
					embed.setThumbnail(body.artwork_url)
						.setTitle('**' + body.title + '**')
						.setURL(body.permalink_url)
						.addField('Song Duration', body.duration, true);
					addtoqueue(message, body);
					if(guildq.queue.length === 1) {
						client.music.play(client, message, settings);
						message.channel.send('✅Now playing: **' + body.title + '**', { embed: embed });
					} else {
						message.channel.send('✅Added to queue: **' + body.title + '**', { embed: embed });
					}
				}
			}
			else message.channel.send('Error: ' + response.statusCode + ' - ' + response.statusMessage);
		});
		return;
	} else {
		request(`http://api.soundcloud.com/tracks?q=${query}&client_id=${process.env.soundcloud}`, async function (error, response, body){
			if(error) throw new Error(error);
			body = JSON.parse(body);
			embed.setThumbnail(body[0].artwork_url)
				.setTitle('**' + body[0].title + '**')
				.setURL(body[0].permalink_url)
				.addField('Song Duration', client.time.msToTime(body[0].duration * 1000), true);
			addtoqueue(message, body[0]);
			if(guildq.queue.length === 1) {
				await client.music.play(client, message, settings);
				message.channel.send('✅Now playing: **' + body[0].title + '**', { embed: embed });
			} else {
				message.channel.send('✅Added to queue: **' + body[0].title + '**', { embed: embed });
			}
		});
	}
};

function addtoqueue(message, video) {
	let guildq = global.guilds[message.guild.id];
	guildq.queue.push({
		url: video.permalink_url,
		title: video.title,
		id: video.id,
		skippers: [],
		requestor: message.author.id,
		seek: 0,
		type: 'soundcloud'
	});
	guildq.isPlaying = true;
}

exports.conf = {
	aliases: ['sc'],
	enabled: true,
	guildOnly: true
};

// Name is the only necessary one.
exports.help = {
	name: 'soundcloud',
	description: 'Plays a song from soundcloud!',
	group: 'music',
	usage: 'soundcloud [song / url]'
};