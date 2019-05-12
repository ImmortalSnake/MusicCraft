exports.run = async (client, message) => {
	const inventory = await client.db.getInv(client, message.author.id);
	if(!inventory) return message.channel.send('You do not have a fishing rod. Use the `s!start` command to start playing');
	const r = inventory.equipped.find(x=>x.name === 'rod').value;
	if(!r) return message.channel.send('You do not have a fishing rod. Use `s!craft fishing rod` to craft one');
	const rod = client.tools.Tools[r];
	let result = '';
	for(const drops in rod.drops) {
		if(Math.random() > rod.drops[drops]) result = drops;
	}
	if(result) {
		const res = inventory.food.find(x=>x.name === result);
		res ? res.value++ : inventory.food.push({ name: result, value: 1 });
	}
	else result = 'Nothing';
	const fish = client.items.Food[result] || { emote: '' };
	const embed = client.embed(message).setDescription(`**:fishing_pole_and_fish: Fish

${message.author.username} tried to fish with a ${r} and found
${result} ${fish.emote}**`);

	await client.db.setInv(inventory, ['tools', 'food']);
	return message.channel.send(embed);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	cooldown: 30 * 60 * 1000
};

exports.help = {
	name: 'fish',
	description: 'Catch fish which you can eat after cooking!',
	group: 'economy',
	usage: 'fish',
};