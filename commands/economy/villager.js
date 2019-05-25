const db = require('quick.db');
const ms = require('ms');

exports.run = async (client, message, args, { mc, prefix }) => {
	const inventory = await mc.get(message.author.id);
	if(!inventory) return message.channel.send(`Please use the \`${prefix}start\` command to start playing`);
	const villager = await db.fetch('villager');
	const em = mc.Materials.Emerald.emote;
	if(!args[0]) { // display store
		let m = '**';
		const res = {};
		for(const mat in villager.store) {
			res[mat] = [villager.store[mat][0], villager.store[mat][1]];
		}
		for(const t in res) {
			const e = mc.Materials[t];
			m += `${res[t][1]} ${em} = ${res[t][0]} ${t} ${e.emote}\n`;
		}
		m += `**
Use \`${prefix}villager [item] [amount of emeralds]\` to buy an item

Trade deals reset in ${ms(villager.time + mc.villageTimer - Date.now(), { long: true })}`;
		const embed = client.embed(message, { title: '**Villager**' }).setDescription(m);
		message.channel.send(embed);
	}
	else {
		const item = args[0].toProperCase();
		const amount = parseInt(args[1]) || 1;
		if(!villager.store[item]) return message.channel.send('The villager is not selling that item');
		const ie = inventory.materials.find(x=>x.name === 'Emerald');
		const mat = inventory.materials.find(x=>x.name === item);
		if(!ie || ie.value < amount) return message.channel.send('You do not have that many emeralds');
		if(villager.store[item][1] > 1 && amount % villager.store[item][1] !== 0) return message.channel.send(`You can trade only multiples of ${villager.store[item][1]} for ${item}`);
		ie.value -= amount;
		const namount = ((villager.store[item][1] > 1) ? amount / villager.store[item][1] : amount) * villager.store[item][0];
		mat ? mat.value += namount : inventory.materials.push({ name: item, value: namount });
		await mc.set(inventory, ['materials']);
		const e = mc.Materials[item];
		const embed = client.embed(message, { title: '**Villager**' })
			.setDescription(`You brought **${namount} ${item} ${e.emote}** for **${amount} Emeralds ${em}**`);
		message.channel.send(embed);
	}
};

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

exports.help = {
	name: 'villager',
	description: 'Displays trade deals with the villager, trade emeralds for materials with the villager. Trade deals reset every 3 hours',
	group: 'economy',
	usage: 'villager'
};