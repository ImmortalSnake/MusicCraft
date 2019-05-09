module.exports.run = async (client, message, args, {settings}) => {
	let check = client.music.check(message, settings, { vc: true, djrole: true});
	if(check) return message.channel.send(check);
	if(message.guild.voiceConnection) {
		global.guilds[message.guild.id].queue = [];
		message.guild.voiceConnection.disconnect();
		message.channel.send('Left the voice channel');
	}
	else {
		message.channel.send('I am not in any voice channel..');
	}
};

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

// Name is the only necessary one.
exports.help = {
	name: 'leave',
	description: 'Clears the queue and leaves the voice channel',
	group: 'music',
	usage: 'leave'
};
