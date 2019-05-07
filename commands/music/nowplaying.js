const YouTube = require('simple-youtube-api');
const config = process.env;
const yt_api_key = config.yt_api_key;
const youtube = new YouTube(yt_api_key);
const youtubedl = require('youtube-dl');

module.exports.run = async (client, message) => {
	let check = await client.checkMusic(message, { playing: true });
	if(check) return message.channel.send(check);
	let guildq = global.guilds[message.guild.id];
	const video = guildq.queue[0];
	const embed = client.embed(message)
		.setTitle(`**${video.title}**`)
		.setURL(video.url)
		.setFooter(`${guildq.queue.length} songs in queue`)
		.addField('**Requested By**', client.users.get(guildq.queue[0].requestor), true);
	if(video.type === 'youtube'){
		youtube.getVideo(video.url, { part: 'contentDetails,snippet' }).then(video => {
			const dur = properFormat(video.duration);
			embed.setDescription(video.description.slice(0, 500))
				.setThumbnail(video.thumbnails.default.url)
				.addField('**Channel**', `**${video.raw.snippet.channelTitle}**`, true)
				.addField('**Duration**', `**${dur}**`, true)
				.addField('**Playing For**', `**${msToTime(guildq.dispatcher.streamTime)}**`, true);
			return message.channel.send(embed);
		});
	}
	else {
		youtubedl.getInfo(video.id, function(err, data) {
			if (err) console.log(err);
			console.log(data);
		});
	}
};

exports.conf = {
	aliases: ['np'],
	enabled: true,
	guildOnly: true
};


exports.help = {
	name: 'nowplaying',
	description: 'Displays some information about the current playing music',
	group: 'music',
	usage: 'np [command]'
};

function msToTime(duration) {
	let seconds = Math.floor((duration / 1000) % 60),
		minutes = Math.floor((duration / (1000 * 60)) % 60),
		hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	hours = (hours < 10) ? '0' + hours : hours;
	minutes = (minutes < 10) ? '0' + minutes : minutes;
	seconds = (seconds < 10) ? '0' + seconds : seconds;

	return hours + ':' + minutes + ':' + seconds;
}

function properFormat(duration) {
	return msToTime((duration.seconds + (duration.minutes * 60) + (duration.hours * 3600)) * 1000);
}
