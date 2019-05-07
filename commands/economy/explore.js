const ms = require('ms');
exports.run = async (client, message) => {
	let inventory = await client.db.getInv(client, message.author.id);
	if(!inventory) return message.channel.send('You do not have a player. Use the `s!start` command to get a player');
	let ptimer = inventory.cooldowns.find(x=>x.name==='explore');
	if(!ptimer) {
		inventory.cooldowns.push({name: 'explore', value: 0});
		ptimer = inventory.cooldowns.find(x=>x.name==='explore');
	}
	if(ptimer.value + client.utils.exploreTimer > Date.now()) {
		const tleft = ptimer.value + client.utils.exploreTimer - Date.now();
		return message.reply('You can explore in ' + ms(tleft, { long: true }));
	}
	ptimer.value = Date.now();
	if(Date.now() - inventory.lastactivity >= client.utils.rhunger && inventory.hunger < 75) inventory.hunger += 25;
	if(inventory.hunger <= 25) await message.channel.send('You are getting hungry. To get food use `s!craft wooden hoe` to craft a hoe and `s!farm` to get food. Use `s!cook [item]` to cook food and get more energy and health. Use `s!eat [item]` to eat food');
	if(inventory.hunger <= 5) return message.channel.send('You are too hungry. Use `s!cook [item]` to cook food and get more energy and health. Use `s!eat [item]` to eat food or wait until your hunger reaches back to 100');
	let embed = client.embed(message, { title: '**Explore**'});
	let chance = Math.random();
	inventory.lastactivity = Date.now();
	if(chance < .9) {
		battle(client, message, inventory);
	}
	else {
		const crates = client.tools.crates;
		let crate;
		let chance = Math.random();
		for(const c in crates) {
			if(crates[c].chance && crates[c].chance < chance) crate = c;
		}
		if(!crate) crate = 'Legendary';
		inventory.crates.push(crate);
		await client.db.setInv(inventory, ['crates', 'cooldowns']);
		embed.setDescription(`You found a ${crate} Crate!!
Use \`s!crate ${crate}\` to open it!`);
		return message.channel.send(embed);
	}
};

async function battle(client, message, inventory) {
	let embed = client.embed(message, {title: '**Explore**'});
	let mobs = Object.keys(client.mobs.Hostile[inventory.dimension]);
	let name = mobs.random();
	let stats = await info(client, inventory, name);
	embed.setDescription(`You have met a ${name}
Do you wish to fight?`)
		.addField('Your stats', 'Health ' + stats.player.hp + '\nAttack ' + stats.player.dmg)
		.addField('Enemy', 'Health ' + stats.mob.hp + '\nAttack ' + stats.mob.dmg)
		.setThumbnail(stats.mob.emote);
	let m = await message.channel.send(embed);
	await m.react('✅');
	await m.react('❎');
	const collector = m.createReactionCollector((reaction, u) => u.id === message.author.id, { time: 240000 });
	collector.on('collect', async (r) => {
		if(r.emoji.name === '❎'){
			message.channel.send(message.author.username + ' did not accept the fight');
			collector.stop();
		}
		else if(r.emoji.name === '✅') {
			fight(client, m, stats, inventory);
			collector.stop();
		}
	});
	collector.on('end', async (r) => {
		if(r.size === 0) return message.reply(message.author.username + ' left the fight');
	});
}

async function fight(client, message, stats, inv) {
	let user = client.users.get(stats.player.id);
	let embed = client.embed(message, {title: '**Fight**'})
		.setDescription('React with 👊 to fight')
		.addField('Your stats', 'Health ' + stats.player.hp + '\nAttack ' + stats.player.dmg)
		.addField('Enemy', 'Health ' + stats.mob.hp + '\nAttack ' + stats.mob.dmg)
		.setThumbnail(stats.mob.emote);
	let m = await message.edit(embed);
	await m.react('👊');
	const collector = m.createReactionCollector((reaction, u) => u.id === user.id, { time: 240000 });
	collector.on('collect', async (r) => {
		if(r.emoji.name === '👊') {
			Math.random() > stats.player.cdef[0] ? stats.player.hp -= stats.mob.crit : stats.player.hp -= stats.mob.dmg - Math.ceil(Math.random() * 10);
			Math.random() > stats.mob.cdef[0] ? stats.mob.hp -=  stats.player.crit : stats.mob.hp -=  stats.player.dmg - Math.ceil(Math.random() * 10);

			if(stats.player.sp > stats.mob.speed) {
				if(stats.mob.hp <= 0) return win(stats, user, message, collector, inv);
				else if(stats.player.hp <= 0) return lose(stats, user, message, collector);
			} else {
				if(stats.player.hp <= 0) return lose(stats, user, message, collector);
				else if(stats.mob.hp <= 0) return win(stats, user, message, collector, inv);
			}
			await fight(client, message, stats, inv);
			collector.stop();
		}
	});
	collector.on('end', async (r) => {
		if(r.size === 0) return message.reply(user.username + ' left the fight like a noob');
	});
}

async function info(client, stats, mob) {
	let enemy = client.mobs.Hostile[stats.dimension][mob];
	let x = {};
	let ne = Object.assign(x, enemy);
	let p = {
		hp: stats.health + (inv(stats, 'chestplate') ? client.tools.Armor[inv(stats, 'chestplate').value].health : 0),
		dmg: stats.attack + (inv(stats, 'sword') ? client.tools.Tools[inv(stats, 'sword').value].dmg : 0),
		crit: inv(stats, 'sword') ? client.tools.Tools[inv(stats, 'sword').value].critical : 20,
		def: inv(stats, 'chestplate') ? client.tools.Armor[inv(stats, 'chestplate')].defense : [1, 5],
		cdef: inv(stats, 'helmet') ? client.tools.Armor[inv(stats, 'helmet').value].crit : [0.5, 0],
		sp: stats.speed + (inv(stats, 'boots') ? client.tools.Armor[inv(stats, 'boots').value].speed : 0),
		luck: stats.luck,
		id: stats.id
	};
	let res = { player: p, mob: ne };
	return res;
}

async function win(stats, user, message, collector, inv) {
	let xp = Math.floor(Math.random() * stats.mob.xp[1]) + stats.mob.xp[0];
	let reward = stats.mob.rewards.random();
	inv.money += reward;
	inv.hunger -= 10;
	inv.xp += xp;
	let drops = Math.random() < stats.mob.drops[1] ? stats.mob.drops[0] : '';
	if(drops) inv.crates.push(stats.mob.drops[0]);
	let winEmbed = message.client.embed(message, {title: '**You Win!**'})
		.setDescription(`You got ${reward}$ and ${xp} XP
${drops ? `You found a ${drops} Crate!\nUse\`s!crate ${drops}\` to open it!` : '' }`);
	message.channel.send(winEmbed);
	await message.client.db.setInv(inv, ['crates', 'cooldowns']);
	// message.client.level(inv, message.channel, user);
	collector.stop();
	return;
}

async function lose(stats, user, message, collector) {
	message.channel.send('You lost');
	collector.stop();
	return;
}

function inv(inventory, n){
	return inventory.equipped.find(x=>x.name===n);
}

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

// Name is the only necessary one.
exports.help = {
	name: 'explore',
	description: 'Fight mobs to get xp and rewards, find crates and much more',
	group: 'economy',
	usage: 'explore'
};