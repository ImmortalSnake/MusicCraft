exports.run = async (client, message, args) => {
	let inventory = await client.db.getInv(client, message.author.id);
	if(!inventory) return message.channel.send('You do not have any materials. Use the `s!start` command to start');
	if(args[0]){
		let cr = args[0].toProperCase();
		let crate = inventory.crates.find(c => c === cr);

		if(!crate) return message.channel.send('Could not find that crate in your inventory');
		let kcrate = Object.keys(client.tools.crates[crate].items);
		let ecrate = Object.values(client.tools.crates[crate].items);
		let m = '**You found:\n\n';
		for(let i = 0; i < kcrate.length; i++) {
			if(kcrate[i] === 'Cash') {
				let cash = Math.floor(Math.random() * ecrate[i][1]) + ecrate[i][0];
				inventory.money += cash;
				m += `${cash}$:dollar:\n`;
			}
			else if(client.items.Materials[kcrate[i]]) {
				let drops = Math.floor(Math.random() * ecrate[i][1]) + ecrate[i][0];
				let emote = client.items.Materials[kcrate[i]].emote;
				const it = inventory.materials.find(x=>x.name===kcrate[i]);
				it ? it.value += drops : inventory.materials.push({name: kcrate[i], value: drops});
				m += `${kcrate[i]}${emote} x${drops}\n`;
			}
			else if(client.items.Food[kcrate[i]]) {
				let drops = Math.floor(Math.random() * ecrate[i][1]) + ecrate[i][0];
				let emote = client.items.Food[kcrate[i]].emote;
				const it = inventory.food.find(x=>x.name===kcrate[i]);
				it ? it.value += drops : inventory.food.push({name: kcrate[i], value: drops});
				m += `${kcrate[i]}${emote} x${drops}\n`;
			}
		}
		inventory.crates.splice(inventory.crates.indexOf(cr), 1);
		m += '**';
		let embed = client.embed(message, {title: `**${cr} Crate**`}).setDescription(m);
		await client.db.setInv(inventory, ['materials', 'tools', 'food']);
		message.channel.send(embed);
	}
	else {
		let crates = '**';
		let x = inventory.crates;
		for(let i = 0; i < x.length; i++){
			crates += `${x[i]} Crate x${x.filter(r => r === x[i]).length}\n`;
			x = x.filter(r => r !== x[i]);
		}
		crates += '**\n\nUse `s!crate [crate]` to open one of them';
		if(crates === '****') crates = 'NO crates found.. Use `s!explore` to find some';
		let embed = client.embed(message, {title: '**Your Crates**'}).setDescription(crates);
		message.channel.send(embed);
	}
};

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

exports.help = {
	name: 'crate',
	description: 'Shows all crates that you own and opens them!',
	group: 'economy',
	usage: 'coin [crate type]'
};