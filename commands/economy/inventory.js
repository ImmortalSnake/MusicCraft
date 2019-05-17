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

function getinv(inventory, type, client) {
	const res = {};
	let m = '**';
	inventory[type.toLowerCase()].forEach(mat => {
		res[mat.name] = mat.value || 0;
	});
	for(const v in res) {
		let e;
		if(client.items[type]) e = client.items[type][v] ;
		else if(client.tools[type]) e = client.tools[type][v];
		if(!e) e = { emote: '' };
		let x = `x${res[v]}\n`;
		if(type === 'Tools' || type === 'Armor') x = ` | Durability ${res[v].durability}\n`;
		else if(typeof res[v] === 'object') x = 'x1\n'; // []
		m += `${v}${e.emote} ${x}`;
	}
	m += '**';
	return m;
}

exports.conf = {
	aliases: ['inv'],
	enabled: true,
	guildOnly: true
};

// Name is the only necessary one.
exports.help = {
	name: 'inventory',
	description: 'Displays your inventory',
	group: 'economy',
	usage: 'inventory'
};