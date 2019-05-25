exports.run = async (client, message, args, { mc, prefix }) => {
	let inventory = await mc.get(message.author.id);
	if(!inventory) return message.channel.send(`Please use the \`${prefix}start\` command to start playing`);
	if(!inventory.other.find(x=>x.name === 'Furnace')) return message.channel.send(`You do not have a furnace. Use \`${prefix}craft furnace\` to craft one`);

	const c = args.join(' ').toProperCase();
	if(!c) return message.channel.send('What would you like to cook');

	const food = mc.recipes[c];
	if(!food) return message.channel.send('You cant cook that now');
	if(!mc.icheck(inventory, food)) return message.channel.send('You do not have enough materials');

	for(const mat in food.materials) {
		const m = inventory.materials.find(x=>x.name === mat.toProperCase());
		const f = inventory.food.find(x=>x.name === mat.toProperCase());
		m ? m.value -= food.materials[mat] : f.value -= food.materials[mat];
	}

	inventory = mc.iadd(inventory, { name: c, value: 1, locate: 'food' });

	const embed = client.embed(message, { title: '**Cook**' })
		.setDescription(`**Successfully cooked a ${c} ${mc.Food[c].emote}
Use \`${prefix}eat ${c}\` to eat it**`);

	await mc.set(inventory, ['materials', 'food']);
	return await message.channel.send(embed);
};

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

exports.help = {
	name: 'cook',
	description: 'Cook food with the materials you have!',
	group: 'economy',
	usage: 'coin [food name]'
};