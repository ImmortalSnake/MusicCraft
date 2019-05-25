exports.run = async (client, message, args, { mc, prefix }) => {
	const inventory = await mc.get(message.author.id);
	if(!inventory) return message.channel.send(`Please use the \`${prefix}start\` command to start playing`);
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

exports.help = {
	name: 'profile',
	description: 'Displays your current stats',
	group: 'economy',
	usage: 'profile'
};