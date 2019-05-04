module.exports.run = async (client, message) => {
	let check = await client.checkMusic(message, { vc: true, djRole: true, playing: true});
	if(check) return message.channel.send(check);
	let guildq = global.guilds[message.guild.id];
	if(!guildq.looping) {
		guildq.looping = true;
	  message.channel.send(':repeat: Looping `ON`');
	} else {
		guildq.looping = false;
		message.channel.send(':repeat: Looping `OFF`');
	}
};

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

// Name is the only necessary one.
exports.help = {
	name: 'loop',
	description: 'Loops the current playing song',
	group: 'music',
	usage: 'loop'
};
