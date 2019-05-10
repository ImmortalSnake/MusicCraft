const discord = require('discord.js');
require('dotenv').config();

module.exports = (client) => {
	client.Discord = discord;
	client.commands = new discord.Collection();
	client.groups = new discord.Collection();
	client.aliases = new discord.Collection();
	client.events = new discord.Collection();
	client.prefix = 's!';
	client.version = '0.9.9 Stable';

	require('./functions.js')(client); // some cool functions
	require('../utils/main.js')(client); // basic client utils
	require('./handlers.js')(client); // command and event handler
	require('./mongoose.js')(client); // database stuff here
	global.guilds = {};

	require('../handlers/commands.js')(client);
	require('../handlers/events.js')(client);
	require('../handlers/app.js');
	client.music = require('./music.js');
};