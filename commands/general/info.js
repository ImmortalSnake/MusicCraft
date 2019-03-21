const commando = require('discord.js-commando');
const discord = require('discord.js');
const ms = require('ms');

class InfoCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'info',
            group: 'util',
            memberName: 'info',
            aliases: ['about'],
            description: 'some information about this bot!',
        });
    }

    async run(message, args) {
      try{
        const bot = message.client;
        const uptime = bot.uptime;
        const bimage = bot.user.displayAvatarURL;
        const myinfo = new discord.RichEmbed()
        .setTitle(bot.user.tag)
        .setURL('https://discordbots.org/bot/447700419855122432')
        .addField('⚙️ Version', ['1.0.0 Stable'], true)
        .addField('👑 Creator', ['ImmortalSnake#9836'], true)
        .addField('⌛ Uptime', ms(uptime), true)
        .addField('🏙️ Guilds', bot.guilds.size, true)
        .addField('👥 Members', bot.guilds.reduce((p, c) => p + c.memberCount, 0), true)
        .addField('💬 Commands', bot.registry.commands.size, true)
        .addField('🔋 Memory Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
        .addField('🔗 Invite', '[Click here](https://discordapp.com/api/oauth2/authorize?client_id=447700419855122432&permissions=8&scope=bot)', true)
        .addField('🤝 Support', '[Click here](https://discord.gg/b8S3HAw)', true)
        .setColor('GREEN')
        .setThumbnail(bimage)
        .setFooter('If you want to see your commands added please use `?suggest` command');

        message.channel.send(myinfo);

      }
      catch(err) {
      message.client.functions.error(message.client, err, message);
      }
    }
}
