exports.run = async (client, message, args) => {
	const inventory = await client.db.getInv(client, message.author.id);
	if(!inventory) return message.channel.send('You do not have any materials. Use the `s!start` command to cook');
	if(!inventory.other.find(x=>x.name === 'Furnace')) return message.channel.send('You do not have a furnace. Use `s!craft furnace` to craft one');
	const c = args.join(' ').toProperCase();
	if(!c) return message.channel.send('What would you like to cook');
	const food = client.items.recipes[c];
	if(!food) return message.channel.send('You cant cook that now');
	if(!check(inventory, food)) return message.channel.send('You do not have enough materials');
	for(const mat in food.materials) {
		const m = inventory.materials.find(x=>x.name === mat.toProperCase());
		const f = inventory.food.find(x=>x.name === mat.toProperCase());
		m ? m.value -= food.materials[mat] : f.value -= food.materials[mat];
	}
	const foo = inventory.food.find(x=>x.name === c);
	foo ? foo.value++ : inventory.food.push({ name: c, value: 1 });
	const embed = client.embed(message, { title: '**Cook**' })
		.setDescription(`**Successfully cooked a ${c} ${client.items.Food[c].emote}.
Use \`s!eat ${c}\` to eat it**`);
	await client.db.setInv(inventory, ['materials', 'food']);
	message.channel.send(embed);
};

function check(inventory, food) {
	for(const mat in food.materials) {
		const m = inventory.materials.find(x=>x.name === mat.toProperCase());
		const f = inventory.food.find(x=>x.name === mat.toProperCase());
		if(m && food.materials[mat] > m.value) return false;
		if(f && food.materials[mat] > f.value) return false;
	}
	return true;
}

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

// Name is the only necessary one.
exports.help = {
	name: 'cook',
	description: 'Cook food with the materials you have!',
	group: 'economy',
	usage: 'coin [food name]'
};