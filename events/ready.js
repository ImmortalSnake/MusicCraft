exports.run = async (client) => {
	if(client.config.maintenance) return client.destroy();
	client.user.setActivity(`${client.guilds.size} Servers | ${client.prefix} help`, { type: 'WATCHING' });
	console.log(client.user.username + ' Has Turned On Successfuly');
	const consoleChannel = client.channels.get(client.config.consoleChannel);
	if(consoleChannel) consoleChannel.send(`Ready with ${client.commands.size} commands`);
	await client.handlers.villager();
};