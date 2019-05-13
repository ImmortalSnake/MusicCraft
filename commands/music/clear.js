module.exports.run = async (client, message, args, { settings }) => {
	const check = client.music.check(message, settings, { vc: true, djrole: true, playing: true });
	if(check) return message.channel.send(check);
	const guildq = global.guilds[message.guild.id];
	message.channel.send(`:white_check_mark: \`${guildq.queue.length - 1}\` **songs removed by ${message.author.tag}**`);
	return guildq.queue = guildq.queue.slice(0, 1);
};

exports.conf = {
	aliases: ['cq'],
	enabled: true,
	guildOnly: true
};

// Name is the only necessary one.
exports.help = {
	name: 'clear',
	description: 'Clears the queue of the server',
	group: 'music',
	usage: 'clear'
};

