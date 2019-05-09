exports.run = async (client, guild) => {
	client.guilddb.findOneAndDelete({id: guild.id});
	console.log(`Guild left ${guild.name}`);
};