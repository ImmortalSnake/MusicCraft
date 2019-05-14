const discord = require('discord.js');
const db = require('quick.db');

module.exports = (client) => {

	client.loadCommand = (commandName) => {
		try {
			let command;
			if (client.commands.has(commandName)) command = client.commands.get(commandName);
			else if (client.aliases.has(commandName)) command = client.commands.get(client.aliases.get(commandName));
			if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;
			const group = command.help.group;
			console.log(`Loading Command: ${command.help.name}`);
			const props = require(`../commands/${group}/${command.help.name}`);
			if (props.init) props.init(client);
			client.commands.set(props.help.name, props);
			props.conf.aliases.forEach(alias => client.aliases.set(alias, props.help.name));
			return false;
		} catch (e) {
			return `Unable to load command ${commandName}: ${e}`;
		}
	};

	client.unloadCommand = async (commandName) => {
		let command;
		if (client.commands.has(commandName)) command = client.commands.get(commandName);
		else if (client.aliases.has(commandName)) command = client.commands.get(client.aliases.get(commandName));
		if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

		if (command.shutdown) await command.shutdown(client);
		const group = command.help.group;
		const mod = require.cache[require.resolve(`../commands/${group}/${command.help.name}`)];
		delete require.cache[require.resolve(`../commands/${group}/${command.help.name}.js`)];
		for (let i = 0; i < mod.parent.children.length; i++) {
			if (mod.parent.children[i] === mod) {
				mod.parent.children.splice(i, 1);
				break;
			}
		}
		return false;
	};

	Object.defineProperty(String.prototype, 'toProperCase', {
		value: function() {
			return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
		}
	});

	Object.defineProperty(Array.prototype, 'random', {
		value: function() {
			return this[Math.floor(Math.random() * this.length)];
		}
	});

	client.wait = require('util').promisify(setTimeout);

	client.formatError = async function(message) {
		message.channel.send('Incorrect Format');
	};

	client.checkInventory = async function(user) {
		const inv = await client.db.getInv(client, user.id);
		const inventory = inv.inventory;
		if(!inventory) return { err: true };
		const def = client.defaultInventory;
		const keys = Object.keys(def);
		const values = Object.values(def);
		for(let i = 0; i < keys.length; i++) {
			if(!inventory[keys[i]]) {
				inventory[keys[i]] = values[i];
			}
			if(typeof values[i] !== typeof inventory[keys[i]]) {
				console.log(keys[i]);
			}
		}
		for(const t in inventory.tools) { if(!inventory.tools[t]) delete inventory.tools[t]; }
		for(const f in inventory.food) { if(!inventory.food[f]) delete inventory.food[f]; }
		return inv;
	};

	client.level = async function(inventory, channel, user) {
		const lvl = inventory.level;
  	const nextlvl = 5 * (lvl ** 2) + 50 * lvl + 100;
		if(nextlvl <= lvl) {
			inventory.level++;
			await db.set(`inventory_${user.id}`, inventory);
			channel.send(`Level Up! You are now in level **${inventory.level}**`);
		}
	};

	client.embed = function(message, options) {
		const color = options ? options.color ? options.color : '#206694' : '#206694';
		const embed = new discord.MessageEmbed()
			.setColor(color)
			.setFooter(message.author.username, message.author.displayAvatarURL())
			.setAuthor(client.user.username, client.user.displayAvatarURL());
		if(options && options.title) embed.setTitle(options.title);
		return embed;
	};
	client.comma = (num) => {
   	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
 	};
};