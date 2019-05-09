module.exports.run = async (client, message, args, {settings}) => {
	let check = await client.music.check(message, settings, { vc: true, playing: true });
	if(check) return message.channel.send(check);
	let guildq = global.guilds[message.guild.id];
	guildq.isPlaying = false;
	guildq.dispatcher.pause();
	return message.channel.send('⏸ Paused the music for you!');
};

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

// Name is the only necessary one.
exports.help = {
	name: 'pause',
	description: 'Pauses the current playing music',
	group: 'music',
	usage: 'pause'
};
