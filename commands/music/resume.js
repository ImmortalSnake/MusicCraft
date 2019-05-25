module.exports.run = async (client, message, args, { settings }) => {
	const check = client.music.check(message, settings, { vc: true, playing: true });
	if(check) return message.channel.send(check);
	const guildq = global.guilds[message.guild.id];
	if(guildq.isPlaying) return message.channel.send('**:x: The music is not paused**');
	guildq.isPlaying = true;
	guildq.dispatcher.resume();
	return message.channel.send('**:play_pause: Resumed the music!**');
};

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

exports.help = {
	name: 'resume',
	description: 'Resumes the music when paused',
	group: 'music',
	usage: 'resume'
};
