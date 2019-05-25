module.exports.run = async (client, message, args, { settings }) => {
	const check = client.music.check(message, settings, { djrole: true, vc: true, playing: true });
	if(check) return message.channel.send(check);
	const guildq = global.guilds[message.guild.id];
	const op = parseInt(args[0]);
	const np = parseInt(args[1]) || 2;
	if(!op) return client.utils.formatError(this, message);
	if(op < 2 || (op - 1) > guildq.queue.length) return message.reply('Position cannot be longer than the queue or below 2');
	if(np < 2 || (np - 1) > guildq.queue.length) return message.reply('Position cannot be longer than the queue or below 2');
	global.guilds[message.guild.id].queue = arraymove(guildq.queue, op - 1, np - 1);
	return message.channel.send('**:musical_note:  Moved the track!**');
};

exports.conf = {
	enabled: true,
	guildOnly: true
};

exports.help = {
	name: 'move',
	description: 'Moves a track',
	group: 'music',
	usage: 'move [old position] [new position]'
};

function arraymove(arr, fromIndex, toIndex) {
	const element = arr[fromIndex];
	arr.splice(fromIndex, 1);
	arr.splice(toIndex, 0, element);
	return arr;
}