exports.run = async (client, message, args, { settings }) => {
	const check = client.music.check(message, settings, { vc: true, playing: true });
	if(check) return message.channel.send(check);
	const guildq = global.guilds[message.guild.id];
	guildq.isPlaying = true;
	guildq.queue.splice(1, 0, guildq.queue[0]);
	guildq.dispatcher.end();
	return message.channel.send('**:repeat_one: Replaying the current playing music!**');
};

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

exports.help = {
	name: 'replay',
	description: 'Replays the current playing music',
	group: 'music',
	usage: 'replay'
};
