exports.run = async (client, guild) => {
	const data = new client.guilddb({
		id: guild.id,
		prefix: client.prefix,
	});
	data.save();
	console.log(`New guild added ${guild.name}`);
};