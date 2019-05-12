exports.run = async (client, message) => {
	const inventory = await client.db.getInv(client, message.author.id);
	if(!inventory) return message.channel.send('You do not have a hoe. Use the `s!start` command to get an hoe');
	if(inventory.dimension === 'Nether') return message.channel.send('You cant farm in the Nether! Use `s!dim overworld` to go back to the overworld');
	const hoe = inventory.equipped.find(x=>x.name === 'hoe');
	if(!hoe) return message.channel.send('You do not have an hoe. Use `s!craft wooden hoe` to get a hoe');
	if(inventory.hunger <= 5) return message.channel.send('You are too hungry. Use `s!cook [item]` to cook food and get more energy and health. Use `s!eat [item]` to eat food or wait until your hunger reaches back to 100');
	const ihoe = inventory.tools.find(x=>x.name === hoe.value);
	if(ihoe.value.durability < 1) return message.channel.send(`You cannot use this hoe anymore as it is broken, please use \`s!repair ${hoe.value}\` to repair it`);
	if(Date.now() - inventory.lastactivity >= client.utils.rhunger && inventory.hunger < 75) inventory.hunger += 25;
	if(inventory.hunger <= 25) await message.channel.send('You are getting hungry. To get food use `s!craft wooden hoe` to craft a hoe and `s!farm` to get food. Use `s!cook [item]` to cook food and get more energy and health. Use `s!eat [item]` to eat food');
	inventory.lastactivity = Date.now();
	inventory.hunger -= 2;
	ihoe.value.durability--;
	const ehoe = client.tools.Tools[hoe.value];
	const drops = Math.floor(Math.random() * ehoe.drops[1]) + ehoe.drops[0];
	const rand = ['Potato', 'Carrot', 'Wheat'].random();
	const food = client.items.Food[rand];
	const ifood = inventory.food.find(foo=>foo.name === rand);
	ifood ? ifood.value += drops : inventory.food.push({ name: rand, value:drops });
	await client.db.setInv(inventory, ['tools', 'food']);
	const embed = client.embed(message, { title: '**Farm**' })
		.setDescription(`**${message.author.username} farmed with ${ehoe.emote}.
You got ${drops} ${food.emote}.**`);
	message.channel.send(embed);

};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	perms: [],
	botPerms: [],
	cooldown: 300 * 1000
};

exports.help = {
	name: 'farm',
	description: 'Farm for food!',
	group: 'economy',
	usage: 'farm',
};