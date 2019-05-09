exports.run = async (client, message, args, {settings}) => {
	let check = client.music.check(message, settings, { vc: true, playing: true });
	if(check) return message.channel.send(check);
	let guildq = global.guilds[message.guild.id];
	guildq.isPlaying = true;
	guildq.queue.splice(1, 0, guildq.queue[0]);
	guildq.dispatcher.end();
	return message.channel.send('▶ Replaying the music for you!');
};

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

// Name is the only necessary one.
exports.help = {
	name: 'replay',
	description: 'Replays the current playing music',
	group: 'music',
	usage: 'replay'
};
