exports.run = async (client, message, args, { mc }) => {
	const inventory = await mc.get(message.author.id);
	if(!inventory) return message.channel.send('You do not have any materials. Use the `s!start` command to start');
	const t = args.join(' ').toProperCase();
	if(!inventory.tools.find(too => too.name === t) && !inventory.armor.find(a=>a.name === t)) return message.channel.send('You do not have that tool');
	const arr = t.split(' ');
	const type = arr[arr.length - 1];
	const tool = mc.Tools[t] || mc.Armor[t];
	const check = inventory.equipped.find(x=>x.name === type.toLowerCase());
	check ? check.value = t : inventory.equipped.push({ name: type.toLowerCase(), value: t });
	await mc.set(inventory, ['equipped']);
	const embed = client.embed(message, { title:'**Equip**' })
		.setDescription(`**Successfully equipped a ${t} ${tool.emote}**`);
	message.channel.send(embed);
};

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

// Name is the only necessary one.
exports.help = {
	name: 'equip',
	description: 'Equip a tool so you can use them',
	group: 'economy',
	usage: 'equip [tool name]'
};