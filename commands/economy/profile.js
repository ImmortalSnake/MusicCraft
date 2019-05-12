exports.run = async (client, message) => {
	const inventory = await client.db.getInv(client, message.author.id);
	if(!inventory) return message.channel.send('You do not have a player. Use the `s!start` command to get a player');
	const embed = client.embed(message, { title: '**Profile**' })
		.addField('Money', inventory.money, true)
		.addField('XP', inventory.xp + ' / ' + inventory.level * 20, true)
		.addField('Level', inventory.level, true)
		.addField('Hunger', inventory.hunger, true)
		.addField('Tools', inventory.tools.length, true);

	message.channel.send(embed);
};

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

// Name is the only necessary one.
exports.help = {
	name: 'profile',
	description: 'Displays your current stats',
	group: 'economy',
	usage: 'profile'
};