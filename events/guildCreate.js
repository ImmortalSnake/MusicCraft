exports.run = async (client, guild) => {
	const data = new client.guilddb({
		id: guild.id,
		prefix: client.prefix,
	});
	data.save();
	console.log(`New guild added ${guild.name}`);
	const consoleChannel = client.channels.get(client.config.consoleChannel);
	if(consoleChannel) consoleChannel.send(`New guild added \`${guild.name}\``);
};