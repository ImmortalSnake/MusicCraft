const discord = require('discord.js');
exports.run = async (client, message, args, { mc }) => {
	const inventory = await mc.get(message.author.id);
	if(!inventory) return message.channel.send('You do not have a player. Use the `s!start` command to get a player');
	const i = args.join(' ').toProperCase();
	const item = ifind(client, i, inventory);
	if(!item) return message.channel.send('Couldnt find that tool in your inventory');
	const locate = ilocate(i, inventory);
	const mbed = client.embed(message)
		.setDescription(`How many ${i} would you like to sell?
**1${item.emote} = ${item.price}$**`);
	await message.channel.send(mbed);
	const collector = new discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { max: 1 });
	collector.on('collect', async m => {
		const num = parseInt(m.content);
		if(!num) return message.channel.send('That was not a number. Please try again');
		const it = inventory[locate].find(n=>n.name === i);
		if(num > it.value) return message.channel.send('Looks like you dont have that many');
		it.value -= num;
		inventory.money -= item.price * num;
		await mc.set(inventory, [locate]);
		const embed = client.embed(message, { title: '**Sell**' })
			.setDescription(`**You sold ${num} ${i}${item.emote} for ${item.price * num}$**`);
		message.channel.send(embed);
	});
};

function ifind(client, item, inventory) {
	const mat = inventory.materials.find(n=>n.name === item);
	const t = inventory.food.find(n=>n.name === item);
	if(mat && mat.value > 0) {
		return client.items.Materials[item];
	}
	else if(t && t.value > 0) {
		return client.items.Food[item];
	}
	else return false;
}

function ilocate(item, inventory) {
	const mat = inventory.materials.find(n=>n.name === item);
	const t = inventory.food.find(n=>n.name === item);
	if(mat) {
		return 'materials';
	}
	else if(t) {
		return 'food';
	}
}

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

// Name is the only necessary one.
exports.help = {
	name: 'sell',
	description: 'Sell materials for money!',
	group: 'economy',
	usage: 'sell [material]'
};