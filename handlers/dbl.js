module.exports = (client, server) => {
	const DBL = require('dblapi.js');
	const dbl = new DBL(process.env.DBLTOKEN, { webhookServer: server, webhookAuth: process.env.auth }, client);

	dbl.webhook.on('vote', async vote => {
		try{
			const user = client.users.get(vote.user);
			console.log(`User with ID ${vote.user} just voted!`);
			if(!user) return;
			const inv = client.mc.get(user.id);
			if(!inv) return;
			inv.crates.push('Voter');
			await client.mc.set(inv, ['crates']);
			return user.send(`Thank You For Voting! You have recieved a crate!\nUse \`${client.prefix}crate voter\` in this dm to open your crate!`);
		}
		catch(error) {
			console.log(error);
		}
	});

	dbl.webhook.on('ready', hook => {
		console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
	});

	dbl.webhook.on('error', e => {
		console.log(`Oops! ${e}`);
	});
};

