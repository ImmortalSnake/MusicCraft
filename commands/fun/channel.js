const discord = require('discord.js');
const moment = require('moment');

module.exports.run = async (client, message, args) => {
	const query = args.join(' ');
	if(!query) return message.channel.send('specify query boi');
	message.channel.send(`:mag_right: Searching for \`${query}\``);
	const embed = new discord.MessageEmbed()
		.setColor('RED')
		.setFooter('Requested by ' + message.author.username, message.author.displayAvatarURL());

	client.music.yt.searchChannels(query, 1, { part: 'snippet' }).then(data => {
		if(!data[0]) return message.channel.send('Sorry, could not find that channel');
		embed.setTitle(data[0].raw.snippet.title)
			.setDescription(data[0].raw.snippet.description);
		client.music.yt.getChannelByID(data[0].id, { part: 'statistics,snippet' }).then(body => {
			const date = body.publishedAt;
			embed.addField('Subscriber Count', client.comma(body.subscriberCount), true)
				.addField('Video Count', client.comma(body.videoCount), true)
				.addField('Total Views', client.comma(body.viewCount), true)
				.addField('Created At', moment.utc(date).format('MM/DD/YYYY h:mm A'), true)
				.setThumbnail(body.thumbnails.default.url)
				.setURL(`https://www.youtube.com/channel/${body.id}`);
			message.channel.send(embed);
		});
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['ytchannel', 'subs', 'youtubechannel', 'subscribers', 'subscriber']
};

exports.help = {
	name: 'channel',
	group: 'fun',
	description: 'Shows current statistics of a youtube channel',
	usage: 'channel [channel name]'
};