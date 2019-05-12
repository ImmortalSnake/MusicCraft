const ms = require('ms');

module.exports.run = async (client, message) => {
	const uptime = client.uptime;
	const bimage = client.user.displayAvatarURL();
	const myinfo = client.embed(message)
		.addField('⚙️ Version', client.version, true)
		.addField('👑 Creator', client.users.get(client.owner).tag, true)
		.addField('⌛ Uptime', ms(uptime), true)
		.addField('🏙️ Guilds', client.guilds.size, true)
		.addField('👥 Members', client.guilds.reduce((p, c) => p + c.memberCount, 0), true)
		.addField('💬 Commands', client.commands.size, true)
		.addField('🔋 Memory Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
		.addField('🔗 Invite', `[Click here](${client.config.invite})`, true)
		.addField('🤝 Support', `[Click here](${client.config.support})`, true)
		.setThumbnail(bimage);

	message.channel.send(myinfo);
};

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: false
};

exports.help = {
	name: 'info',
	description: 'Shows the stats and information of the bot!',
	group: 'general',
	usage: 'info'
};
