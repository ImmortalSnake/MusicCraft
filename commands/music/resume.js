module.exports.run = async (client, message, args, { settings }) => {
	const check = client.music.check(message, settings, { vc: true, playing: true });
	if(check) return message.channel.send(check);
	const guildq = global.guilds[message.guild.id];
	guildq.isPlaying = true;
	guildq.dispatcher.resume();
	return message.channel.send('▶ Resumed the music for you!');
};

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

// Name is the only necessary one.
exports.help = {
	name: 'resume',
	description: 'Resumes the music when paused',
	group: 'music',
	usage: 'resume'
};
