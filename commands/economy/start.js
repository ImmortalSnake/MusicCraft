const db = require('quick.db');

exports.run = async (client, message) => {
	const inventory = await client.inv.findOne({ id: message.author.id });
	if(inventory) return message.channel.send('You already have a profile');
	const actualinv = await db.fetch(`inventory_${message.author.id}`);
	client.db.createInv(client, message.author.id, actualinv);
	const embed = client.embed(message).setDescription(`Welcome ${message.author.username}!
You received your <:woodenaxe:560778791643774976>
You can now type \`s!chop\` to collect some wood`);
	return message.channel.send(embed);
};

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

exports.help = {
	name: 'start',
	description: 'Start your new minecraft adventure with this command!',
	group: 'economy',
	usage: 'start'
};