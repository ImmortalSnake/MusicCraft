exports.run = async (client) => {
  if(client.config.maintenance) return client.destroy();
	client.user.setActivity(`${client.guilds.size} Servers | s!help`, { type: 'WATCHING' });
	console.log(client.user.username + ' Has Turned On Successfuly');
	client.villager();
};