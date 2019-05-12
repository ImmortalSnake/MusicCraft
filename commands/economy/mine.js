exports.run = async (client, message) => {
	let inventory = await client.db.getInv(client, message.author.id);
	if(!inventory) return message.channel.send('You do not have a pickaxe .Use the `s!start` command to get a pickaxe');

	const pick = inventory.equipped.find(e => e.name === 'pickaxe');
	if(!pick) return message.channel.send('You do not have a pickaxe. Chop some wood with `s!chop` and craft a pickaxe using `s!craft`');
	if(inventory.hunger <= 5) return message.channel.send('You are too hungry. Use `s!cook [item]` to cook food and get more energy and health. Use `s!eat [item]` to eat food or wait until your hunger reaches back to 100');

	if(Date.now() - inventory.lastactivity >= client.utils.rhunger && inventory.hunger < 75) inventory.hunger += 25;
	if(inventory.hunger %2 === 0 && inventory.hunger <= 25) await message.channel.send('You are getting hungry. To get food use `s!craft wooden hoe` to craft a hoe and `s!farm` to get food. Use `s!cook [item]` to cook food and get more energy and health. Use `s!eat [item]` to eat food');

	const ipick = inventory.tools.find(e => e.name === pick.value).value;
	if(ipick.durability < 1) return message.channel.send(`You cannot use this pickaxe anymore as it is broken, please use \`s!repair ${pick.value}\` to repair it`);
	inventory.hunger-= 0.25;
	inventory.lastactivity = Date.now();
	let mines = client.items.Materials;
	let p = client.tools.Tools[pick.value];
	let result = {};
	let m = `**${message.author.username} mined with a ${p.emote} and found`;
	let drops = p.drops;
	if(inventory.dimension !== 'Overworld') drops = p[inventory.dimension];

	if(!drops) return message.channel.send(`Cannot mine with this pickaxe in the ${inventory.dimension}`);
	for(const mat in drops) {
		if(drops[mat][2] && Math.random() > drops[mat][2]) continue;
		result[mat] = Math.floor(Math.random() * drops[mat][1]) + drops[mat][0];
		let imat = inventory.materials.find(m=>m.name===mat);
		imat ? imat.value += result[mat] : imat = { name: mat, value: result[mat]};
	}

	ipick.durability--;
	for(const r in result) {
		let emote = mines[r].emote;
		m += `\n ${emote} ${r} x${result[r]}`;
	}
	m += '**';
	await client.db.setInv(inventory, ['materials', 'tools']);

	let embed = client.embed(message, {title: '**Mine**'}).setDescription(m);
	message.channel.send(embed);
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