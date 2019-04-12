const db = require('quick.db');
const discord = require('discord.js');
exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have any materials .Use the `s!start` command to get a pickaxe')
    let rand = Object.keys(client.mobs.Animals).random()
    let animal = client.mobs.Animals[rand]
    let embed = new discord.MessageEmbed()
    .setTitle('Hunt')
    .setColor('#206694')
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setDescription(`You met a ${rand} ${animal.emote}
Do you want to tame it or kill it
React with :regional_indicator_t: to tame it and :regional_indicator_k: to kill it`)
   let m = await message.channel.send(embed)
   await m.react('🇰')
   await m.react('🇹')
    const collector = m.createReactionCollector(
      (reaction, u) => u.id == message.author.id,
            { time: 240000 });
  collector.on('collect', async (r) => {
    if(r.emoji.name == '🇰'){
  let drops = Math.floor(Math.random() * animal.drops) + animal.drops
  let result = {}
  let m = `**${message.author.username} killed a ${rand} and got`
  for(const mat in animal.drops) {
    if(animal.drops[mat][2] && Math.random() > animal.drops[mat][2]) continue;
    result[mat] = Math.floor(Math.random() * animal.drops[mat][1]) + animal.drops[mat][0]
    inventory.materials[mat] ? inventory.materials[mat] += result[mat] : inventory.food[mat] ? inventory.food[mat] += result[mat] : inventory.food[mat] = result[mat]
  }
      console.log(result)
  for(const r in result) {
    let e = client.items.Materials[r] ||  client.items.Food[r]
    m += `\n ${e.emote} ${r} x${result[r]}`
  }
  m += `**`
  let membed = new discord.MessageEmbed()
  .setTitle('KILL')
  .setColor('#206694')
  .setAuthor(message.author.username, message.author.displayAvatarURL())
  .setDescription(m)
  message.channel.send(membed)
      collector.stop();
      }
else if(r.emoji.name == '🇹') {
  let tembed = new discord.MessageEmbed()
  .setTitle('Tame')
  .setColor('#206694')
  .setAuthor(message.author.username, message.author.displayAvatarURL())
  .setDescription(`**${message.author.username} tamed a ${rand} ${animal.emote}
Use \`s!animal ${rand}\` to breed it, kill it or get materials**`)
  message.channel.send(tembed) 
  collector.stop();
      }
    });
    collector.on('end', async (r) => {
      if(r.size == 0) return message.reply(`The ${rand} ${animal.emote} left..`);
    });
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'hunt',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}