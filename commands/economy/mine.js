exports.run = async (client, message, args, { mc, prefix }) => {
	let inventory = await mc.get(message.author.id);
	if(!inventory) return message.channel.send(`Please use the \`${prefix}start\` command to start playing`);

	const pick = inventory.equipped.find(e => e.name === 'pickaxe');
	if(!pick) return message.channel.send(`You do not have a pickaxe. Chop some wood with \`${prefix}chop\` and craft a pickaxe using \`${prefix}craft\``);

	inventory = mc.activity(inventory, this, message, prefix);
	if(!inventory) return;

	const ipick = inventory.tools.find(e => e.name === pick.value).value;
	if(ipick.durability < 1) return message.channel.send(`You cannot use this pickaxe anymore as it is broken, please use \`${prefix}repair ${pick.value}\` to repair it`);

	const mines = mc.Materials;
	const p = mc.Tools[pick.value];
	const result = {};
	let m = `**${message.author.username} mined with a ${p.emote} and found`;
	let drops = p.drops;
	if(inventory.dimension !== 'Overworld') drops = p[inventory.dimension];

	if(!drops) return message.channel.send(`Cannot mine with this pickaxe in the ${inventory.dimension}`);
	for(const mat in drops) {
		if(drops[mat][2] && Math.random() > drops[mat][2]) continue;
		result[mat] = Math.floor(Math.random() * drops[mat][1]) + drops[mat][0];
		const imat = inventory.materials.find(x=>x.name === mat);
		imat ? imat.value += result[mat] : inventory.materials.push({ name: mat, value: result[mat] });
	}

	ipick.durability--;
	for(const r in result) {
		const emote = mines[r].emote;
		m += `\n ${emote} ${r} x${result[r]}`;
	}
	m += '**';
	await mc.set(inventory, ['materials', 'tools']);

	const embed = client.embed(message, { title: '**Mine**' }).setDescription(m);
	return message.channel.send(embed);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	cooldown: 5000
};

exports.help = {
	name: 'mine',
	description: 'Mine for materials and diamonds!',
	group: 'economy',
	usage: 'mine'
};