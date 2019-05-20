const db = require('quick.db');

module.exports = (client) => class Handlers {
	constructor(options) {
		this.options = options;
	}
	async villager() {
		const villageTime = 10800000;
		let villager = await db.fetch('villager');
		if(!villager || villager.time + villageTime < Date.now()) await generate(client);
		villager = await db.fetch('villager');
		const tleft = villager.time + villageTime - Date.now();
		setTimeout(async () => {
			await generate();
			return this.villager();
		}, tleft);
	}

	loadCommand(commandName) {
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
			if(props.conf.aliases) props.conf.aliases.forEach(alias => client.aliases.set(alias, props.help.name));
			return false;
		} catch (e) {
			return `Unable to load command ${commandName}: ${e}`;
		}
	}

	async unloadCommand(commandName) {
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
	}
};

async function generate() {
	const n = {
		time: Date.now(),
		store: {
			Wood: [rand(100, 50), 1],
			Coal: [rand(80, 50), 1],
			Stone: [rand(120, 80), 1],
			Dirt: [rand(250, 150), 1],
			Iron: [rand(50, 20), 1],
			Redstone: [rand(6, 2), 1],
			Lapis: [rand(6, 2), 1],
			Gold: [1, rand(2, 1)],
			Diamond: [1, rand(4, 2)]
		}
	};
	console.log('Generating villager');
	await db.set('villager', n);
}

function rand(num1, num2) {
	return Math.floor(Math.random() * num1) + num2;
}