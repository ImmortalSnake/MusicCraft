exports.run = async (client, guild) => {
	client.guilddb.findOneAndDelete({ id: guild.id });
	const consoleChannel = client.channels.get(client.config.consoleChannel);
	if(consoleChannel) consoleChannel.send(`Guild left \`${guild.name}\``);
};