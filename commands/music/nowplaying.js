const youtubedl = require('youtube-dl');

module.exports.run = async (client, message, args, {settings}) => {
	let check = client.music.check(message, settings, { playing: true });
	if(check) return message.channel.send(check);
	let guildq = global.guilds[message.guild.id];
	const video = guildq.queue[0];
	const embed = client.embed(message)
		.setTitle(`**${video.title}**`)
		.setURL(video.url)
		.setFooter(`${guildq.queue.length} song(s) in queue`)
		.addField('**Requested By**', client.users.get(guildq.queue[0].requestor), true);
	if(video.type === 'youtube'){
		client.music.yt.getVideo(video.url, { part: 'contentDetails,snippet' }).then(video => {
			const dur = client.time.properFormat(video.duration);
			embed.setDescription(video.description.slice(0, 500))
				.setThumbnail(video.thumbnails.default.url)
				.addField('**Channel**', `**${video.raw.snippet.channelTitle}**`, true)
				.addField('**Duration**', `**${dur}**`, true)
				.addField('**Playing For**', `**${client.time.msToTime(guildq.dispatcher.streamTime)}**`, true);
			return message.channel.send(embed);
		});
	}
	else {
		youtubedl.getInfo(video.id, function(err, data) {
			if (err) console.log(err);
			if (data.description) embed.setDescription(data.description.slice(0, 500));
      if (data.thumbnail) embed.setThumbnail(data.thumbnail);
      if (data._duration_hms) embed.addField('**Duration**', `**${data._duration_hms}**`, true);
      embed.addField('**Playing For**', `**${client.time.msToTime(guildq.dispatcher.streamTime)}**`, true);
      return message.channel.send(embed);
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

