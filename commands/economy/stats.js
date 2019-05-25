exports.run = async (client, message, args, { mc, prefix }) => {
	const inventory = await mc.get(message.author.id);
	if(!inventory) return message.channel.send(`Please use the \`${prefix}start\` command to start playing`);
	if(!args[0]) return message.channel.send(`The correct format is \`${prefix}stats [item]\``);
	const t = args.join(' ').toProperCase();
	const item = mc.find(t);
	if(!item) return message.channel.send('Could not find that tool');
	const tool = item.value;
	const emo = tool.emote || mc.Food[t].emote;
	let s = '';
	if(tool.durability) s += `**Durability** ${tool.durability}\n`;
	if(tool.dmg) s += `**Damage** ${tool.dmg}\n`;
	if(tool.speed) s += `**Speed** ${tool.speed}\n`;
	if(tool.energy) s += `**Energy** ${tool.energy}\n`;
	if(tool.critical) s += `**Critical Damage** ${tool.critical}\n`;
	if(tool.health) s += `**Health** ${tool.health}\n`;
	const embed = client.embed(message)
		.setDescription(`**${t} ${emo} Stats\n**`)
		.addField('**Materials Required**', `**${gen(mc, tool, 'materials')} ${gen(mc, tool, 'other')}**`, true);
	if(s) embed.addField('**Stats**', s, true);
	if(tool.repair) embed.addField('**Repair**', `**${gen(mc, tool, 'repair')}**`, true);
	if(tool.drops) {
		let x = '**';
		if(Array.isArray(tool.drops)) x += `Wood ${mc.Materials.Wood.emote} ${tool.drops[0]} - ${tool.drops[1] + tool.drops[0] - 1}`;
		else {
			const foo = {};
			for(const oth in tool.drops) {
				foo[oth] = tool.drops[oth];
			}
			for(const f in foo) {
				const e = mc.Materials[f.toProperCase()] || mc.Food[f.toProperCase()] || mc.Other[f.toProperCase()];
				x += `${f.toProperCase()} ${e.emote} ${foo[f][0] || 1} - ${foo[f][1] || 1} | ${foo[f][2] * 100 || 100}%\n`;
			}
		}
		x += '**';
		embed.addField('**Drops**', x, true);
	}
	return message.channel.send(embed);
};

function gen(mc, tool, type) {
	let r = '';
	const foo = {};
	for(const oth in tool[type]) {
		foo[oth] = tool[type][oth];
	}
	for(const t in foo) {
		const e = mc.Materials[t.toProperCase()] || mc.Food[t.toProperCase()] || mc.Other[t.toProperCase()];
		r += `${t.toProperCase()} ${e.emote} x${foo[t]}\n`;
	}
	return r;
}

exports.conf = {
	aliases: [],
	enabled: true,
	guildOnly: true
};

exports.help = {
	name: 'stats',
	description: 'View all details of any food, armor, tool',
	group: 'economy',
	usage: 'stats [item]'
};