exports.run = async (client) => {
	client.user.setActivity(`${client.guilds.size} Servers | s!help`, { type: 'WATCHING' });
	console.log(client.user.username + ' Has Turned On Successfuly');
	client.villager();
};