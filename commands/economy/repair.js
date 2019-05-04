exports.run = async (client, message, args) => {
	let inventory = await client.db.getInv(client, message.author.id);
	if(!inventory) return message.channel.send('You do not have any tools. Use the `s!start` command to get an axe');
	if(!args[0]) return message.channel.send('Correct format is `s!repair [tool]`');

	const t = args.join(' ').toProperCase();
	const l = locate(inventory, t);
	if(!l) return message.channel.send('Could not find that item in your inventory');
	let tool = client.tools[l.toProperCase()][t];
	if(!check(inventory, tool)) return message.channel.send('You do not have enough materials');
	inventory[l].find(i=>i.name===t).value.durability = tool.durability;
	for(const mat in tool.repair) {
		inventory.materials.find(m=>m.name===mat.toProperCase()).value -= tool.repair[mat];
	}
	await message.client.db.setInv(inventory, ['materials', 'tools']);
	let embed = client.embed(message, { title: '**Repair**'})
		.setDescription(`**You successfully repaired your ${t} ${tool.emote}**`);
	return message.channel.send(embed);
};

function locate(inventory, t) {
	if(inventory.tools.find(x=>x.name===t)) return 'tools';
	if(inventory.armor.find(x=>x.name===t)) return 'armor';
	return false;
}

function check(inventory, tool) {
	for(const mat in tool.repair) {
		const mats = inventory.materials.find(m=>m.name===mat.toProperCase());
		if(!mats || tool.repair[mat] > mats.value) return false;
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
	name: 'repair',
	description: 'Repair the tools so you can reuse them',
	group: 'economy',
	usage: 'repair [tool name]'
};