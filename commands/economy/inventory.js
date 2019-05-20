exports.run = async (client, message, args, { mc }) => {
	const inventory = await mc.get(message.author.id);
	if(!inventory) return message.channel.send('You do not have a player. Use the `s!start` command to get a player');

	const embed = client.embed(message)
		.setTitle('**Inventory**')
		.addField('Materials', mc.ishow(inventory, 'Materials', client), true)
		.addField('Tools', mc.ishow(inventory, 'Tools', client), true)
		.addField('Food', mc.ishow(inventory, 'Food', client), true)
		.addField('Armor', mc.ishow(inventory, 'Armor', client), true)
		.addField('Other', mc.ishow(inventory, 'Other', client), true);
	message.channel.send(embed);
};

exports.conf = {
	aliases: ['inv'],
	enabled: true,
	guildOnly: true
};

exports.help = {
	name: 'inventory',
	description: 'Displays your inventory',
	group: 'economy',
	usage: 'inventory'
};