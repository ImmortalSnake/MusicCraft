exports.run = async (client, message, args, { prefix, mc }) => {
	const inventory = await mc.get(message.author.id);
	if(!inventory) return message.channel.send(`You do not have a player. Use the \`${prefix}start\` command to start`);
	if(!args[0]) return message.channel.send(`Mention the user you want to trade with or if you already in a trade use \`${prefix}trade [option]\``);
	const user = message.mentions.members.first();
	if(!user) {
		const trade = inventory.trade[0];
		if(!trade) return message.channel.send(`You are not in a trade with anyone. Use \`${prefix}trade [@user]\` to start trading!`);
		const user2 = await mc.get(trade.user);
		const trade2 = user2.trade[0];

		switch(args[0].toLowerCase()) {
		case 'add': {
			if(trade.confirmed) return message.channel.send(`You have already confirmed the trade use \`${prefix}trade cancel\` to cancel this trade`);
			const item = args.slice(1).join(' ').split('-')[0].trim().toProperCase();
			const amount = parseInt(args.join(' ').split('-')[1]) || 1;
			if(!item) return message.channel.send(`Use \`${prefix}trade add [item] -[amount]\` to add materials or food to the trade`);
			let locate = await ifind(client, item, inventory);
			if(item === 'Money') locate = [{ emote: ':dollar:' }, inventory.money];
			if(!locate[0]) return message.channel.send('Could not find that item in your inventory');
			const total = trade.give[0][item] ? trade.give[0][item] + amount : amount;
			if(total > locate[1]) return message.channel.send('You do not have that many items in your inventory or balance');
			trade.give[0][item] ? inventory.trade[0].give[0][item] += amount : inventory.trade[0].give[0][item] = amount;
			await mc.set(inventory, ['trade']);
			const aembed = client.embed(message, { title: '**Trade Add**' })
				.setDescription(`**Successfully added ${item} ${locate[0].emote} x${amount} to the trade**`);
			return message.channel.send(aembed);
		}
		case 'remove': {
			if(trade.confirmed) return message.channel.send(`You have already confirmed the trade use \`${prefix}trade cancel\` to cancel this trade`);
			const item = args.slice(1).join(' ').toProperCase();
			if(!trade.give[0][item]) return message.channel.send(`That item is not in the trade. Use \`${prefix}trade add [item] -[amount]\` to add materials or food to the trade`);
			delete inventory.trade[0].give[0][item];
			await mc.set(inventory, ['trade']);
			const rembed = client.embed(message, { title: '**Trade Remove**' })
				.setDescription(`**Successfully removed ${item} from the trade**`);
			return message.channel.send(rembed);
		}
		case 'info': {
			const trader = client.users.get(trade.user);
			let g = '**';
			let r = '**';
			const res = {};
			const foo = {};
			for(const c in trade.give[0]) {
				res[c] = trade.give[0][c] || 0;
			}
			for(const v in res) {
				const e = mc.Materials[v] || mc.Tools[v] || mc.Food[v] || { emote: ':dollar:' };
				g += `${v}${e.emote} x${res[v]}\n`;
			}
			for(const c in trade2.give[0]) {
				foo[c] = trade2.give[0][c] || 0;
			}
			for(const v in foo) {
				const e = mc.Materials[v] || mc.Tools[v] || mc.Food[v] || { emote: ':dollar:' };
				r += `${v}${e.emote} x${foo[v]}\n`;
			}
			g += '**';
			r += '**';
			const iembed = client.embed(message, { title: '**Trade Info**' })
				.addField('You are giving', g)
				.addField('You will recieve', r)
				.setFooter(trader.tag, trader.displayAvatarURL());
			message.channel.send(iembed);
			break;
		}
		case 'confirm': {
			const trader = client.users.get(trade.user);
			let g = '**';
			let r = '**';
			const res = {};
			const foo = {};
			for(const c in trade.give[0]) {
				res[c] = trade.give[0][c] || 0;
			}
			for(const v in res) {
				const e = mc.Materials[v] || mc.Tools[v] || mc.Food[v] || { emote: ':dollar:' };
				g += `${v}${e.emote} x${res[v]}\n`;
			}

			for(const c in trade2.give[0]) {
				foo[c] = trade2.give[0][c] || 0;
			}
			for(const v in foo) {
				const e = mc.Materials[v] || mc.Tools[v] || mc.Food[v] || { emote: ':dollar:' };
				r += `${v}${e.emote} x${foo[v]}\n`;
			}
			g += '**';
			r += '**';
			const iembed = client.embed(message, { title: '**Trade Info**' })
				.addField('You are giving', g)
				.addField('You will recieve', r)
				.setDescription(`**Do you wish to confirm the trade with ${trader.tag}
React with ✅ to confirm the trade**`)
				.setFooter(trader.tag, trader.displayAvatarURL());
			const m = await message.channel.send(iembed);
			await m.react('✅');
			await m.react('❎');
			const collector = m.createReactionCollector((reaction, u) => u.id === message.author.id);
			collector.on('collect', async (em) => {
				if(em.emoji.name === '❎') {
					message.reply('did not confirm the trade');
					collector.stop();
					return;
				}
				else if(em.emoji.name === '✅') {
					const inventory2 = user2;
					if(inventory2.trade[0].confirmed) {
						for(const v in res) {
							if(v === 'Money' && inventory.money >= res[v]) {
								inventory.money -= res[v];
								inventory2.money += res[v];
								continue;
							}
							if(inv(inventory, 'materials', v) && inv(inventory, 'materials', v).value >= res[v]) {
								inv(inventory, 'materials', v).value -= res[v];
								inv(inventory2, 'materials', v) ? inv(inventory2, 'materials', v).value += res[v] : inv(inventory2, 'materials', v).value = res[v];
							}
							if(inv(inventory, 'food', v) && inv(inventory, 'food', v).value >= res[v]) {
								inv(inventory, 'food', v).value -= res[v];
								inv(inventory2, 'food', v) ? inv(inventory2, 'food', v).value += res[v] : inv(inventory2, 'food', v).value = res[v];
							}
						}
						for(const t in foo) {
							if(t === 'Money' && inventory2.money >= foo[t]) {
								inventory.money += foo[t];
								inventory2.money -= foo[t];
								continue;
							}
							if(inv(inventory2, 'materials', t) && inv(inventory2, 'materials', t).value >= foo[t]) {
								inv(inventory2, 'materials', t).value -= foo[t];
								inv(inventory, 'materials', t) ? inv(inventory, 'materials', t).value += foo[t] : inv(inventory, 'materials', t).value = foo[t];
							}
							if(inv(inventory2, 'food', t) && inv(inventory2, 'food', t).value >= foo[t]) {
								inv(inventory2, 'food', t).value -= foo[t];
								inv(inventory, 'food', t) ? inv(inventory, 'food', t).value += foo[t] : inv(inventory, 'food', t).value = foo[t];
							}
						}
						inventory.trade = inventory2.trade = [];
						await mc.set(inventory, ['trade', 'materials', 'food']);
						await mc.set(inventory2, ['trade', 'materials', 'food']);
						return message.channel.send(`The trade between <@${message.author.id}> and <@${trade.user}> was completed!`);
					}
					inventory.trade[0].confirmed = true;
					await mc.set(inventory, ['trade']);
					return message.channel.send(`<@${message.author.id}> confirmed! Waiting confirmation from <@${trade.user}>
Please use \`${prefix}trade confirm\` again to confirm!`);
				}
			});
			break;
		}
		case 'cancel': {
			const trader = client.users.get(trade.user);
			const confirmEmbed = client.embed(message, { title: '**Cancel Trade**' })
				.setFooter(trader.tag, trader.displayAvatarURL())
				.setDescription(`**Do you wish to cancel the trade with ${trader.tag}
React with ✅ to cancel the trade**`);
			const m = await message.channel.send(confirmEmbed);
			await m.react('✅');
			await m.react('❎');
			const collector = m.createReactionCollector((reaction, u) => u.id === message.author.id);
			collector.on('collect', async (r) => {
				if(r.emoji.name === '❎') {
					message.channel.send('Trade was not cancelled');
					collector.stop();
					return;
				}
				else if(r.emoji.name === '✅') {
					inventory.trade = user2.trade = [];
					await mc.set(inventory, ['trade']);
					await mc.set(user2, ['trade']);
					return message.channel.send(`The trade between <@${message.author.id}> and <@${trade.user}> was cancelled by <@${message.author.id}>`);
				}
			});
			break;
		}
		default: {
			return message.channel.send('Mention the user you want to trade with');
		}
		}
	}else{
		if(inventory.trade[0]) return message.channel.send('You are already in a trade with someone else');
		if(user.id === message.author.id) return message.channel.send('You cant trade with yourself');
		let inventory2 = await mc.get(user.id);
		if(!inventory2) return message.channel.send('That user does not have a player.');

		if(inventory2.trade[0]) return message.channel.send(user.user.username + ' is already in a trade with someone else');
		const embed = client.embed(message, { title: '**Trade Request**' })
			.setDescription(`**${user.user.username}, You have recieved a trade request from ${message.author.username}**
React to confirm or deny the trade request`)
			.setFooter(user.user.tag, user.user.displayAvatarURL());
		const m = await message.channel.send(embed);
		await m.react('✅');
		await m.react('❎');
		const collector = m.createReactionCollector((reaction, u) => u.id === user.user.id);
		collector.on('collect', async (r) => {
			if(r.emoji.name === '❎') {
				message.reply(user.user.username + ' did not accept the trade request');
				collector.stop();
				return;
			}
			else if(r.emoji.name === '✅') {
				inventory2 = await mc.get(user.id);
				if(inventory2.trade[0]) return message.channel.send(user.user.username + ' is already in a trade with someone else');
				const cembed = client.embed(message, { title: '**Trade Request Accepted**' })
					.setDescription(`**${user.user.username}, confirmed the trade request from ${message.author.username}**
Use \`${prefix}trade add [item] -[amount]\` to add materials or food to the trade
Use \`${prefix}trade remove [item]\` to remove materials or food to trade
Use \`${prefix}trade info\` to view the current trade
Use \`${prefix}trade confirm\` to confirm
Use \`${prefix}trade cancel\` to cancel the trade`)
					.setFooter(user.user.tag, user.user.displayAvatarURL());
				await message.channel.send(`The trade request sent by <@${message.author.id}> was accepted by <@${user.id}>`);
				message.channel.send(cembed);
				const deftrade1 = { user: user.id, give: [{}], confirmed: false };
				const deftrade2 = { user: message.author.id, give: [{}], confirmed: false };
				inventory.trade[0] = deftrade1;
				inventory2.trade[0] = deftrade2;
				await mc.set(inventory, ['trade']);
				await mc.set(inventory2, ['trade']);
				collector.stop();
			}
		});
	}
};

async function ifind(client, item, inventory) {
	const mat = inventory.materials.find(x=>x.name === item);
	const f = inventory.food.find(x=>x.name === item);
	if(mat && mat.value > 0) {
		return [client.items.Materials[item], mat.value];
	}
	else if(f && f.value > 0) {
		return [client.items.Food[item], f.value];
	}
	else return false;
}

function inv(inventory, locate, n) {
	return inventory[locate].find(x=>x.name === n);
}
exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

exports.help = {
	name: 'trade',
	description: 'Trade materials and money with other users!',
	group: 'economy',
	usage: 'trade [@user]'
};
