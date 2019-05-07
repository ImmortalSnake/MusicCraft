module.exports.run = async (client, message, args) => {
	let check = await client.checkMusic(message, { playing: true });
	if(check) return message.channel.send(check);
	let guildq = global.guilds[message.guild.id];
	let page = parseInt(args[0]) || 1;
	let total = Math.ceil(guildq.queue.length / 9);
	if(page > total) page = total;
	const mess = client.embed(message);
	guildq.looping ? mess.setTitle('Music Queue for ' + message.guild.name + ' *LOOPING*') : mess.setTitle('Music Queue for ' + message.guild.name);
	let message2 = '';
	for (let i = 0; i < guildq.queue.length; i++) {
		if(i > 9 * page || i < (9 * page) - 9) continue;
		message2 += `\n${(i + 1)} : [${guildq.queue[i].title}](${guildq.queue[i].url})${(i === 0 ? ' **(Current Song)**' : '')}\n~ Requested By: ${client.users.get(guildq.queue[i].requestor)}\n`;
	}
	mess.setFooter(`Page ${page}/${total} | ${guildq.queue.length} songs in queue`);
	mess.setDescription(message2);
	message.channel.send(mess);
};

exports.conf = {
	aliases: ['q'],
	enabled: true,
	guildOnly: true
};

// Name is the only necessary one.
exports.help = {
	name: 'queue',
	description: 'Shows the music queue for the server!',
	group: 'music',
	usage: 'queue [page number]'
};

