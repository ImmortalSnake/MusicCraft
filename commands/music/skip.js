const db = require('quick.db');
module.exports.run = async (client, message) => {
	let check = await client.checkMusic(message, { vc: true, playing: true});
	if(check) return message.channel.send(check);
	let guildq = global.guilds[message.guild.id];
	if (guildq.queue[0].skippers.indexOf(message.author.id) === -1) {
		guildq.queue[0].skippers.push(message.author.id);
		let settings = await db.fetch(`settings_${message.guild.id}`);
		if(message.member.roles.has(settings.djRole) || message.member.hasPermission('ADMINISTRATOR')){
			guildq.dispatcher.end();
			return message.reply('✅ Your skip has been acknowledged. Skipping now!');
		} else if ((Math.ceil((guildq.voiceChannel.members.size - 1) / 2) - guildq.queue[0].skippers.length) === 0) {
			guildq.dispatcher.end();
			return message.reply('✅ Your skip has been acknowledged. Skipping now!');
		} else  message.reply(' your skip has been acknowledged. You need **' + (Math.ceil((guildq.voiceChannel.members.size - 1) / 2) - guildq.queue[0].skippers.length) + '**  more skip votes!');
	} else {
		message.reply(' you already voted to skip!');
	}
};

exports.conf = {
	aliases: ['s'],
	enabled: true,
	guildOnly: true
};

// Name is the only necessary one.
exports.help = {
	name: 'skip',
	description: 'Skips the current playing music',
	group: 'music',
	usage: 'skip'
};

