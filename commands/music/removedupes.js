exports.run = async (client, message, args, {settings}) => {
	let check = client.music.check(message, settings, { vc: true, playing: true, djrole: true });
	if(check) return message.channel.send(check);
	let guildq = global.guilds[message.guild.id];
	let old = guildq.queue.length;
	guildq.queue = rd(guildq.queue);
	let nq = guildq.queue.length;
	message.reply(`The queue dupes has been cleared by ${message.author}. \`${old-nq}\` songs removed `);
};


exports.conf = {
	aliases: ['rd'],
	enabled: true,
	guildOnly: true
};

exports.help = {
	name: 'removedupes',
	description: 'Removes duplicate songs from the queue.',
	group: 'music',
	usage: 'removedupes'
};

function rd(q) {
	let nq = [];
	q.forEach(e => {if(!nq.includes(e)) nq.push(e);});
	return nq;
}