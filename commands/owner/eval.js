/* eslint-disable no-unused-vars */
const db = require('quick.db');
const discord = require('discord.js');
const fetch = require('node-superfetch');
const ms = require('ms');
const pastebin = require('pastebin-js');
const mongoose = require('mongoose');
const paste = new pastebin(process.env.pastekey);

module.exports.run = async (client, message, args, { settings, prefix }) => {
	if (message.author.id !== client.owner) return message.reply ('you are not allowed to use this command');
	if(args.join(' ').toLowerCase().includes('token')) return;
	if (!args) return message.channel.send('Incorrect usage. Please use Java Script.');
	const embed = client.embed(message, { color: 'BLACK', title: '**Evaluation**' });
	const t1 = message.createdAt;
	try {
		const codein = args.join(' ');
		let code = eval(codein);
		if (typeof code !== 'string') code = require('util').inspect(code, { depth: 0 });
		if(code.includes(client.token)) code = code.replace(client.token, '--TOKEN--');
		const t2 = Date.now() - t1;
		if(code.length > 1024) {
			try {
				const data = await paste.createPaste(code);
				embed.setURL(data)
					.addField(':inbox_tray: Input', `\`\`\`js\n${codein}\`\`\``)
					.addField(':outbox_tray: Output', `\`\`\`js\n${code.slice(0, 1000)}\n\`\`\``)
					.addField('Time Taken', `${t2} ms`)
					.setDescription('**Output was too long, uploaded to pastebin!**');
				return message.channel.send(embed);
			} catch(err) {
				console.log(err);
			}
		}
		embed.addField(':inbox_tray: Input', `\`\`\`js\n${codein}\`\`\``)
			.addField(':outbox_tray: Output', `\`\`\`js\n${code}\n\`\`\``)
			.addField('Time Taken', `${t2} ms`);
		return message.channel.send(embed);
	} catch(e) {
		message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
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