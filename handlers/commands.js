const fs = require('fs');
module.exports = client => {
	fs.readdir('./commands/', (err, groups) => {
		if (err) throw new Error(`\n[Commands]\tThere was an error! \n${err}`);
		groups.forEach(group =>{
			fs.readdir(`./commands/${group}/`, (err, files) =>{
				if (err) throw new Error(`\n[Commands]\tThere was an error! \n${err}`);
				let jsfiles = files.filter(f => f.split('.').pop() === 'js');
				if (jsfiles.length === 0) throw new Error('\n[Commands]\tNo commands to load.');
				jsfiles.map(file => {
					let commandName = file.split('.')[0];
					let commandFunction = require(`./../commands/${group}/${file}`);
					if(!commandFunction.help) return console.log(`${commandName} is not completed`);
					let commandname = commandFunction.help.name || commandName;
					if (!commandFunction.run) return console.log(`${commandName} has no run function.`);
					if(client.commands.get(commandname)) throw new Error(`\n${commandname} has already been registered`);
					if(Array.from(client.aliases.keys()).find(e => {commandFunction.conf.aliases.includes(e); })) throw new Error(`\nAn alias of ${commandname} has already been registered`);
					if(client.aliases.has(commandName)) throw new Error(`\nAn alias with ${commandname} has already been registered`);

					client.commands.set(commandname, commandFunction);
					commandFunction.conf.aliases.map(alias => client.aliases.set(alias, commandname));
				});
				console.log(`[Commands]\tLoaded a total amount ${jsfiles.length} commands in ${group}`);
				client.groups.set(group, client.commands.filter(cmd => cmd.help.group === group));
			});
		});
	});
};