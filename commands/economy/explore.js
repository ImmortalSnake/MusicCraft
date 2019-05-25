const ms = require('ms');
exports.run = async (client, message, args, { mc, prefix }) => {
	let inventory = await mc.get(message.author.id);
	if(!inventory) return message.channel.send(`Please use the \`${prefix}start\` command to start playing`);
	let ptimer = inventory.cooldowns.find(x=>x.name === 'explore');
	if(!ptimer) {
		inventory.cooldowns.push({ name: 'explore', value: 0 });
		ptimer = inventory.cooldowns.find(x=>x.name === 'explore');
	}
	if(ptimer.value + mc.exploreTimer > Date.now()) {
		const tleft = ptimer.value + mc.exploreTimer - Date.now();
		return message.reply('You can explore in ' + ms(tleft, { long: true }));
	}
	ptimer.value = Date.now();

	inventory = mc.activity(inventory, this, message, prefix);
	if(!inventory) return;

	const embed = client.embed(message, { title: '**Explore**' });
	const chance = Math.random();

	if(chance < 0.9) {
		battle(mc, message, inventory, prefix);
	}
	else {
		const crates = mc.crates;
		let crate;
		const chance2 = Math.random();
		for(const c in crates) {
			if(crates[c].chance && crates[c].chance < chance2) crate = c;
		}
		if(!crate) crate = 'Legendary';
		inventory.crates.push(crate);
		await mc.set(inventory, ['crates', 'cooldowns']);
		embed.setDescription(`You found a ${crate} Crate!!
Use \`${prefix}crate ${crate}\` to open it!`);
		return message.channel.send(embed);
	}
};

async function battle(mc, message, inventory, p) {
	const embed = mc.client.embed(message, { title: '**Explore**' });
	const mobs = Object.keys(mc.mobs.Hostile[inventory.dimension]);
	const name = mobs.random();
	const stats = await info(mc, inventory, name);
	embed.setDescription(`You have met a ${name}
Do you wish to fight?`)
		.addField('Your stats', 'Health ' + stats.player.hp + '\nAttack ' + stats.player.dmg)
		.addField('Enemy', 'Health ' + stats.mob.hp + '\nAttack ' + stats.mob.dmg)
		.setThumbnail(stats.mob.emote);
	const m = await message.channel.send(embed);
	await m.react('✅');
	await m.react('❎');
	const collector = m.createReactionCollector((reaction, u) => u.id === message.author.id, { time: 240000 });
	collector.on('collect', async (r) => {
		if(r.emoji.name === '❎') {
			message.channel.send(message.author.username + ' did not accept the fight');
			collector.stop();
		}
		else if(r.emoji.name === '✅') {
			fight(mc.client, m, stats, inventory, p);
			collector.stop();
		}
	});
	collector.on('end', async (r) => {
		if(r.size === 0) return message.reply(message.author.username + ' left the fight');
	});
}

async function fight(client, message, stats, inv1, p) {
	const user = client.users.get(stats.player.id);
	const embed = client.embed(message, { title: '**Fight**' })
		.setDescription('React with 👊 to fight')
		.addField('Your stats', 'Health ' + stats.player.hp + '\nAttack ' + stats.player.dmg)
		.addField('Enemy', 'Health ' + stats.mob.hp + '\nAttack ' + stats.mob.dmg)
		.setThumbnail(stats.mob.emote);
	const m = await message.edit(embed);
	await m.react('👊');
	const collector = m.createReactionCollector((reaction, u) => u.id === user.id, { time: 240000 });
	collector.on('collect', async (r) => {
		if(r.emoji.name === '👊') {
			Math.random() > stats.player.cdef[0] ? stats.player.hp -= stats.mob.crit : stats.player.hp -= stats.mob.dmg - Math.ceil(Math.random() * 10);
			Math.random() > stats.mob.cdef[0] ? stats.mob.hp -= stats.player.crit : stats.mob.hp -= stats.player.dmg - Math.ceil(Math.random() * 10);

			if(stats.player.sp > stats.mob.speed) {
				if(stats.mob.hp <= 0) return win(stats, user, message, collector, inv1, p);
				else if(stats.player.hp <= 0) return lose(stats, user, message, collector);
			} else if(stats.player.hp <= 0) return lose(stats, user, message, collector);
			else if(stats.mob.hp <= 0) return win(stats, user, message, collector, inv1, p);
			await fight(client, message, stats, inv1, p);
			collector.stop();
		}
	});
	collector.on('end', async (r) => {
		if(r.size === 0) return message.reply(user.username + ' left the fight like a noob');
	});
}

async function info(mc, stats, mob) {
	const enemy = mc.mobs.Hostile[stats.dimension][mob];
	const x = {};
	const ne = Object.assign(x, enemy);
	const p = {
		hp: stats.health + (inv(stats, 'chestplate') ? mc.Armor[inv(stats, 'chestplate').value].health : 0),
		dmg: stats.attack + (inv(stats, 'sword') ? mc.Tools[inv(stats, 'sword').value].dmg : 0),
		crit: inv(stats, 'sword') ? mc.Tools[inv(stats, 'sword').value].critical : 20,
		def: inv(stats, 'chestplate') ? mc.Armor[inv(stats, 'chestplate')].defense : [1, 5],
		cdef: inv(stats, 'helmet') ? mc.Armor[inv(stats, 'helmet').value].crit : [0.5, 0],
		sp: stats.speed + (inv(stats, 'boots') ? mc.Armor[inv(stats, 'boots').value].speed : 0),
		luck: stats.luck,
		id: stats.id
	};
	const res = { player: p, mob: ne };
	return res;
}

async function win(stats, user, message, collector, inv1, p) {
	const xp = Math.floor(Math.random() * stats.mob.xp[1]) + stats.mob.xp[0];
	const reward = stats.mob.rewards.random();
	inv1.money += reward;
	inv1.hunger -= 10;
	inv1.xp += xp;
	const drops = Math.random() < stats.mob.drops[1] ? stats.mob.drops[0] : '';
	if(drops) inv1.crates.push(stats.mob.drops[0]);
	const winEmbed = message.client.embed(message, { title: '**You Win!**' })
		.setDescription(`You got ${reward}$ and ${xp} XP
${drops ? `You found a ${drops} Crate!\nUse\`${p}crate ${drops}\` to open it!` : '' }`);
	message.channel.send(winEmbed);
	await message.client.mc.set(inv1, ['crates', 'cooldowns']);
	// message.client.level(inv, message.channel, user);
	collector.stop();
	return;
}

async function lose(stats, user, message, collector) {
	message.channel.send('You lost');
	collector.stop();
	return;
}

function inv(inventory, n) {
	return inventory.equipped.find(x=>x.name === n);
}

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

exports.help = {
	name: 'explore',
	description: 'Fight mobs to get xp and rewards, find crates and much more',
	group: 'economy',
	usage: 'explore'
};