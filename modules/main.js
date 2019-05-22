const discord = require('discord.js');

module.exports = (client) => {
	class MusicCraft extends client {
		constructor(option) {

			super(option);
			this.Discord = discord;
			this.commands = new discord.Collection();
			this.groups = new discord.Collection();
			this.aliases = new discord.Collection();
			this.events = new discord.Collection();
			require('../config.js')(this);
			require('../utils/main.js')(this); // basic client utils
			require('./mongoose.js')(this); // database stuff here
			global.guilds = {};

			require('../handlers/commands.js')(this); // command and event handler
			require('../handlers/events.js')(this);
			require('../handlers/app.js');
			const handlers = require('./handlers.js')(this);
			const player = require('./music.js')(this);
			const minecraft = require('./minecraft.js')(this);
			const utils = require('../utils/util');
			this.utils = new utils({});
			this.handlers = new handlers({});
			this.music = new player(this.config.music);
			this.mc = new minecraft(this.config.minecraft);

		}

		embed(message, options) {
			const color = options ? options.color ? options.color : '#206694' : '#206694';
			const embed = new discord.MessageEmbed()
				.setColor(color)
				.setFooter(message.author.username, message.author.displayAvatarURL())
				.setAuthor(this.user.username, this.user.displayAvatarURL());
			if(options && options.title) embed.setTitle(options.title);
			if(options && options.url) embed.setURL(options.url);
			return embed;
		}
	}

	return MusicCraft;
};