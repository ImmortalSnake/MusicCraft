const db = require('quick.db');
const discord = require('discord.js');
const ms = require('ms')

exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have a player .Use the `s!start` command to get a player');
  const ptimer = await db.fetch(`timers_${message.author.id}_explore`);
   if(ptimer + client.utils.exploreTimer > Date.now()) {
        const tleft = ptimer + client.utils.exploreTimer - Date.now();
        return message.reply('You can explore in ' + ms(tleft, { long: true }));
      }
  await db.set(`timers_${message.author.id}_explore`, Date.now());
  inventory = await client.checkInventory(message.author)
  if(Date.now() - inventory.lastactivity >= client.utils.rhunger && inventory.hunger < 75) inventory.hunger += 25
  if(inventory.hunger <= 25) await message.channel.send('You are getting hungry. To get food use `s!craft wooden hoe` to craft a hoe and `s!farm` to get food. Use `s!cook [item]` to cook food and get more energy and health. Use `s!eat [item]` to eat food')
  if(inventory.hunger <= 5) return message.channel.send('You are too hungry. Use `s!cook [item]` to cook food and get more energy and health. Use `s!eat [item]` to eat food or wait until your hunger reaches back to 100')
  let embed = new discord.MessageEmbed()
  .setTitle('Explore')
  .setColor('#206694')
  .setAuthor(message.author.username, message.author.displayAvatarURL())
  let chance = Math.random()
  inventory.lastactivity = Date.now()
  await db.set(`inventory_${message.author.id}`, inventory)
  if(chance < .85) {
    battle(client, message, embed)
  }
  else {
    const crates = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
    let crate
    let random = Math.random()
    if (random < .5) crate = crates[0];
    else if (random < .75) crate = crates[1]; 
    else if (random < .91) crate = crates[2];
    else if (random < .98) crate = crates[3];
    else crate = crates[4]
    inventory.crates.push(crate)
    inventory.hunger-= 5
    await db.set(`inventory_${message.author.id}`, inventory)
    embed.setDescription(`You found a ${crate} Crate!!
Use \`s!crate ${crate}\` to open it!`)
    return message.channel.send(embed)
  }
}

async function battle(client, message, embed) {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  let mobs = Object.keys(client.mobs.Hostile[inventory.dimension])
  let name = mobs.random()
  let mob = client.mobs.Hostile[inventory.dimension][name]
  if (inventory.equipped.sword) inventory.attack += client.tools.Tools[inventory.equipped.sword].dmg
  embed.setDescription(`You have met a ${name}
Do you wish to fight?`)
    .addField('Your stats', 'Health ' + inventory.health + '\nAttack ' + inventory.attack)
    .addField('Enemy', 'Health ' + mob.hp + '\nAttack ' + mob.dmg)
    .setThumbnail(mob.emote)
    let m = await message.channel.send(embed)
  await m.react('✅')
  await m.react('❎')
  const collector = m.createReactionCollector(
      (reaction, u) => u.id == message.author.id,
            { time: 240000 });
  collector.on('collect', async (r) => {
    if(r.emoji.name == '❎'){
        message.channel.send(message.author.username + ' did not accept the fight');
        collector.stop();
      }
      else if(r.emoji.name == '✅') {
      fight(m, message.author, inventory, mob, mob.hp, message)
      collector.stop();
      }
    });
    collector.on('end', async (r) => {
      if(r.size == 0) return message.reply(message.author.username + ' did not accept the fight');
    });
}

async function fight(message, user, inventory, mob, hp, mess) {
  let embed = new discord.MessageEmbed()
  .setTitle('Fight')
  .setDescription('React with 👊 to fight')
  .addField('Your stats', 'Health ' + inventory.health + '\nAttack ' + inventory.attack)
  .addField('Enemy', 'Health ' + hp + '\nAttack ' + mob.dmg)
  .setColor('#206694')
  .setAuthor(message.author.username, message.author.displayAvatarURL())
  .setThumbnail(mob.emote)
  let m = await message.edit(embed)
  await m.react('👊')
  const collector = m.createReactionCollector(
      (reaction, u) => u.id === user.id,
      { time: 240000 });
  collector.on('collect', async (r) => {
      if(r.emoji.name == '👊') {
      inventory.health = inventory.health - Math.floor(Math.random() * mob.dmg * 3)
      hp = hp - Math.floor(Math.random() * inventory.attack * 3)
      if(hp <= 0){
        let xp = Math.floor(Math.random() * mob.xp[1]) + mob.xp[0]
        let reward = mob.rewards.random()
        let inv = await db.fetch(`inventory_${user.id}`)
        inv.hunger -= 10
        inv.xp += xp;
        let drops = Math.random() < mob.drops[1] ? mob.drops[0] : ''
        if(drops) inv.crates.push(mob.drops[0])
        if (inventory.equipped.sword) inventory.attack -= message.client.tools.Tools[inventory.equipped.sword].dmg
        await db.set(`inventory_${user.id}`, inv)
        let winEmbed = new discord.MessageEmbed()
        .setTitle('You Win')
        .setColor('#206694')
        .setAuthor(user.username, user.displayAvatarURL())
        .setDescription(`You got ${reward}$ and ${xp} XP
${drops ? `You found a ${drops} Crate!\nUse\`s!crate ${drops}\` to open it!` : '' }`)
        message.channel.send(winEmbed)
        message.client.level(inv, mess)
        collector.stop();
        return;
      }
      if(inventory.health <= 0){ 
        message.channel.send('You lost')
        collector.stop();
        return;
      }
      await fight(m, user, inventory, mob, hp, mess)
      collector.stop();
        }
    });
    collector.on('end', async (r) => {
      if(r.size == 0) return message.reply(user.username + ' did not fight');
    });
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'explore',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}