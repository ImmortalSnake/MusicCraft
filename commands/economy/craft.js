exports.run = async (client, message, args) => {
	if(!args[0]) return message.channel.send('Correct format is `s!craft [item]`');
	const inventory = await client.db.getInv(client, message.author.id);
	if(!inventory) return message.channel.send('You do not have any materials .Use the `s!start` command');

	const t = args.join(' ').toProperCase();
	const tool = ok(t, client);
	if(!tool) return message.channel.send('That item is not craftable right now!');
	if(!check(inventory, tool)) return message.channel.send('You do not have enough materials');

	const embed = client.embed(message, { title:'**Craft**' });
	switch(tool.type) {

	case 'Armor': {
		if(inventory.armor.find(x=>x.name === t)) return message.channel.send('You already own this tool');
		for(const mat in client.tools.Armor[t].materials) {
			inventory.materials.find(m=>m.name === mat.toProperCase()).value -= client.tools.Armor[t].materials[mat];
		}
		inventory.armor.push({ name: t, value: { durability : tool.durability, enchant: '' } });
		embed.setDescription(`Successfully crafted a ${t} ${tool.emote}.
Use \`s!equip ${t}\` to equip it!`);
		await message.client.db.setInv(inventory, ['materials', 'armor']);
		return message.channel.send(embed);
	}
	case 'Other': {
		for(const mat in tool.materials) {
			inventory.materials.find(m=>m.name === mat.toProperCase()).value -= tool.materials[mat];
		}
		for(const oth in tool.other) {
			inventory.other.find(m=>m.name === oth.toProperCase()).value -= tool.other[oth];
		}
		const ot = inventory.other.find(x=>x.name === t);
		if(tool.onetime) {
			if(ot) return message.channel.send(`You already have a ${t}`);
			inventory.other.push({ name: t, value: 1 });
		} else {
			ot ? ot.value++ : inventory.other.push({ name: t, value: 1 });
		}
		embed.setDescription(`Successfully crafted a ${t} ${tool.emote}`);
		message.channel.send(embed);
		await message.client.db.setInv(inventory, ['materials', 'other']);
		return;
	}
	case 'Normal': {
		generate(inventory, tool, t, message);
		return;
	}
	}
};
function check(inventory, tool) {
	for(const mat in tool.materials) {
		const mats = inventory.materials.find(m=>m.name === mat.toProperCase());
		if(!mats || tool.materials[mat] > mats.value) return false;
	}
	if(tool.other) {
		for(const oth in tool.other) {
			const other = inventory.other.find(o=>o.name === oth.toProperCase());
			if(!other || tool.other[oth] > other.value) return false;
		}
	}
	return true;
}

function ok(tool, client) {
	const x = client.tools.Tools[tool.toProperCase()];
	if(x) return x;

	const y = client.tools.Armor[tool.toProperCase()];
	if(y) return y;

	if(client.tools.Other[tool.toProperCase()]) return client.tools.Other[tool.toProperCase()];
	return false;
}

async function generate(inventory, tool, name, message) {
	const itool = inventory.tools.find(x=>x.name === name);
	if(itool) return message.channel.send('You already own this tool');
	for(const mat in tool.materials) {
		inventory.materials.find(m=>m.name === mat.toProperCase()).value -= tool.materials[mat];
	}
	// (inventory.tools[name]) ? inventory.tools[name]++ : inventory.tools[name] = 1;
	const newtool = { name: name, value: { durability : tool.durability, enchant: '' } };
	inventory.tools.push(newtool);
	await message.client.db.setInv(inventory, ['materials', 'tools']);
	const embed = message.client.embed(message, { title: '**Craft**' })
		.setDescription(`**Successfully crafted a ${name} ${tool.emote}
Use \`s!equip ${name}\` to equip it**`);
	return await message.channel.send(embed);
}

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

// Name is the only necessary one.
exports.help = {
	name: 'craft',
	description: 'Craft tools, armor and other items that help you on your adventure!',
	group: 'economy',
	usage: 'craft [item name]'
};