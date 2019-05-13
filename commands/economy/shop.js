const db = require('quick.db');

exports.run = async (client, message, args) => {
	const inventory = await db.fetch(`inventory_${message.author.id}`);
	if(!inventory) return message.channel.send('You do not have any materials .Use the `s!start` to start playing!');
	const embed = client.embed(message);
	if(!args[0]) {
		const m = 'Use `s!shop bonus` or `s!shop enchants` to see all the items in the shop!';
		message.channel.send(m);
	} else {
		const t = args[0].toProperCase();
		const shop = client.shop[t];
		const id = parseInt(args[1]);

		if (id) {
			const item = getItem(id, shop);
			if(!item) return message.channel.send('Could not find an item with that id!');
			const mat = item.price[0];
			if(!inventory.materials[mat] || inventory.materials[mat] < item.price[1]) return message.channel.send('You do not have enough materials');
			inventory.materials[mat] -= item.price[1];
			console.log(inventory);
		} else {
			if(!shop) return message.channel.send('Use `s!shop bonus` or `s!shop enchants` to see all the items in the shop!');
			embed.setTitle(`**${t}**`);
			let m = '';
			for(const s in shop) {
				let mats = '';
				for(const p in shop[s].price) {
					mats += `${shop[s].price[p]} ${client.items.Materials[p].emote}`;
				}
				m += `ID: ${shop[s].id} ~ **${s}** ~ Price: ${mats}\n`;
			}
			m += `\n Use \`s!shop ${t} <id>\` to buy an item`;
			embed.setDescription(m);
			message.channel.send(embed);
		}
	}
};

function getItem(id, shop) {
	for(const s in shop) {
		if(shop[s].id === id) return shop[s];
	}
	return false;
}

exports.conf = {
	aliases: [],
	enabled: false,
	guildOnly: true
};

// Name is the only necessary one.
exports.help = {
	name: 'shop',
	description: 'View and buy special items from the shop!',
	group: 'economy',
	usage: 'shop [bonus / enchants]'
};