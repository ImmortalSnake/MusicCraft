module.exports.run = async (client, message, args, { settings }) => {
	const check = await client.music.check(message, settings, { vc: true, playing: true });
	if(check) return message.channel.send(check);
	const guildq = global.guilds[message.guild.id];
	guildq.isPlaying = false;
	guildq.dispatcher.pause();
	return message.channel.send('**⏸ Paused the music!**');
};

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

exports.help = {
	name: 'pause',
	description: 'Pauses the current playing music',
	group: 'music',
	usage: 'pause'
};
