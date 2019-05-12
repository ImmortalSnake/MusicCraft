module.exports.run = async (client, message, args, { settings }) => {
	const check = client.music.check(message, settings, { vc: true, djrole: true, playing: true });
	if(check) return message.channel.send(check);
	const guildq = global.guilds[message.guild.id];
	guildq.queue = guildq.queue.slice(0, 1);
	return message.channel.send('The queue has been cleared by ' + message.author);
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

