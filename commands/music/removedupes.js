exports.run = async (client, message, args, { settings }) => {
	const check = client.music.check(message, settings, { vc: true, playing: true, djrole: true });
	if(check) return message.channel.send(check);
	const guildq = global.guilds[message.guild.id];
	const old = guildq.queue.length;
	guildq.queue = client.music.removedupes(guildq.queue);
	const nq = guildq.queue.length;
	message.reply(`**:white_check_mark: \`${old - nq}\` songs removed, by ${message.author.tag} **`);
};


exports.conf = {
	aliases: ['rd'],
	enabled: true,
	guildOnly: true
};

// Name is the only necessary one.
exports.help = {
	name: 'removedupes',
	description: 'Removes duplicate songs from the queue.',
	group: 'music',
	usage: 'removedupes'
};