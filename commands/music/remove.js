module.exports.run = async (client, message, args, { settings }) => {
	if(!parseInt(args)) return message.channel.send('That was not a valid number');
	const check = client.music.check(message, settings, { vc: true, playing: true, djrole: true });
	if(check) return message.channel.send(check);
	const guildq = global.guilds[message.guild.id];

	if(!guildq.queue[args - 1]) return message.reply('Could not find a music in that id');
	message.channel.send(`**:white_check_mark: Removed** \`${guildq.queue[args - 1].title}\``);
	return guildq.queue.splice(0, args - 1);
};


exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

// Name is the only necessary one.
exports.help = {
	name: 'remove',
	description: 'Removes a song from the queue',
	group: 'music',
	usage: 'remove [position number in queue]'
};