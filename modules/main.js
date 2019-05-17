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
      require('./functions.js')(this); // some cool functions
      require('../utils/main.js')(this); // basic client utils
      require('./handlers.js')(this); // command and event handler
      require('./mongoose.js')(this); // database stuff here
      global.guilds = {};

      require('../handlers/commands.js')(this);
      require('../handlers/events.js')(this);
      require('../handlers/app.js');
      const player = require('./music.js')(this);
      const minecraft = require('./minecraft.js')(this);
      this.music = new player(this.config.music);
      this.mc = new minecraft(this.config.minecraft);

    }
  }

  return MusicCraft;
};