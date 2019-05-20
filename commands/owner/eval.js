/* eslint-disable no-unused-vars */
const db = require('quick.db');
const discord = require('discord.js');
const fetch = require('node-superfetch');
const ms = require('ms');
const mongoose = require('mongoose');

module.exports.run = async (client, message, args, { settings, prefix, mc }) => {
	if (message.author.id !== client.owner) return message.reply ('you are not allowed to use this command');
	if(args.join(' ').toLowerCase().includes('token')) return;
	if (!args) return message.channel.send('Incorrect usage. Please use Java Script.');
	const embed = client.embed(message, { color: 'BLACK', title: '**Evaluation**' });
	const t1 = process.hrtime();
	try {
		const codein = args.join(' ');
		let code = eval(codein);
		if (code instanceof Promise || (Boolean(code) && typeof code.then === 'function' && typeof code.catch === 'function')) code = await code;
		if (typeof code !== 'string') code = require('util').inspect(code, { depth: 0 });
		code = code.replace(client.token, '--TOKEN--');
		const token = client.token.split('').join('[^]{0,2}');
		const rev = client.token.split('').reverse().join('[^]{0,2}');
		const filter = new RegExp(`${token}|${rev}`, 'g');
		code = code.replace(filter, '--TOKEN--');
		code = client.utils.clean(code);
		const t2 = process.hrtime(t1);
		embed.addField(':inbox_tray: Input', `\`\`\`js\n${codein}\`\`\``);
		if(code.length > 1024) {
			try {
				const data = await fetch.post('https://hastebin.com/documents').send(code);
				embed.setURL(`https://hastebin.com/${data.body.key}`)
					.addField(':outbox_tray: Output', `\`\`\`js\n${code.slice(0, 1000)}\n\`\`\``)
					.setDescription(`**Output was too long, uploaded to [Hastebin](https://hastebin.com/${data.body.key})!**`)
					.addField('⏱ Time Taken', `${t2[0] > 0 ? `${t2[0]}s ` : ''}${t2[1] / 1000000}ms`);
				return message.channel.send(embed);
			} catch(err) {
				console.log(err);
			}
		}
		embed.addField(':outbox_tray: Output', `\`\`\`js\n${code}\n\`\`\``)
			.addField('⏱ Time Taken', `${t2[0] > 0 ? `${t2[0]}s ` : ''}${t2[1] / 1000000}ms`);
		return message.channel.send(embed);
	} catch(e) {
		return message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
	}
};


exports.conf = {
	aliases: ['evaluate'],
};

exports.help = {
	name: 'eval',
	description: 'Evaluates a JS code.',
	usage: 'eval [code]',
	group: 'owner'
};