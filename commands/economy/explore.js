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
  let embed = client.embed(message)
  .setTitle('Explore')
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
  let stats = await info(client, message.author, name)
    console.log(stats)
  // let mob = client.mobs.Hostile[inventory.dimension][name]
 // if (inventory.equipped.sword) inventory.attack += client.tools.Tools[inventory.equipped.sword].dmg
  embed.setDescription(`You have met a ${name}
Do you wish to fight?`)
    .addField('Your stats', 'Health ' + stats.player.hp + '\nAttack ' + stats.player.dmg)
    .addField('Enemy', 'Health ' + stats.mob.hp + '\nAttack ' + stats.mob.dmg)
    .setThumbnail(stats.mob.emote)
    let m = await message.channel.send(embed)
  await m.react('✅')
  await m.react('❎')
  const collector = m.createReactionCollector((reaction, u) => u.id == message.author.id, { time: 240000 });
  collector.on('collect', async (r) => {
    if(r.emoji.name == '❎'){
        message.channel.send(message.author.username + ' did not accept the fight');
        collector.stop();
      }
      else if(r.emoji.name == '✅') {
      fight(client, m, stats)
      collector.stop();
      }
    });
    collector.on('end', async (r) => {
      if(r.size == 0) return message.reply(message.author.username + ' left the fight');
    });
}

async function fight(client, message, stats) {
  let user = client.users.get(stats.player.id)
  let embed = new discord.MessageEmbed()
  .setTitle('Fight')
  .setDescription('React with 👊 to fight')
  .addField('Your stats', 'Health ' + stats.player.hp + '\nAttack ' + stats.player.dmg)
  .addField('Enemy', 'Health ' + stats.mob.hp + '\nAttack ' + stats.mob.dmg)
  .setColor('#206694')
  .setAuthor(user.username, user.displayAvatarURL())
  .setThumbnail(stats.mob.emote)
  let m = await message.edit(embed)
  await m.react('👊')
  const collector = m.createReactionCollector((reaction, u) => u.id === user.id, { time: 240000 });
  collector.on('collect', async (r) => {
      if(r.emoji.name == '👊') {
      Math.random() > stats.player.cdef[0] ? stats.player.hp -= stats.mob.crit : stats.player.hp -= stats.mob.dmg - Math.ceil(Math.random() * 10)
      Math.random() > stats.mob.cdef[0] ? stats.mob.hp -=  stats.player.crit : stats.mob.hp -=  stats.player.dmg - Math.ceil(Math.random() * 10)

    if(stats.player.sp > stats.mob.speed) {
      if(stats.mob.hp <= 0) return win(stats, user, message, collector)
      else if(stats.player.hp <= 0) return lose(stats, user, message, collector)
    } else {
      if(stats.player.hp <= 0) return lose(stats, user, message, collector)
      else if(stats.mob.hp <= 0) return win(stats, user, message, collector)
    }
      await fight(client, message, stats)
      collector.stop();
        }
    });
    collector.on('end', async (r) => {
      if(r.size == 0) return message.reply(user.username + ' left the fight like a noob');
    });
}

async function info(client, player, mob) {
  let stats = await db.fetch(`inventory_${player.id}`)
  let enemy = client.mobs.Hostile[stats.dimension][mob]
  let x = {}
  let ne = Object.assign(x, enemy)
  let p = {
    hp: stats.health + (stats.equipped.chestplate ? client.tools.Armor[stats.equipped.chestplate].health : 0),
    dmg: stats.attack + (stats.equipped.sword ? client.tools.Tools[stats.equipped.sword].dmg : 0),
    crit: stats.equipped.sword ? client.tools.Tools[stats.equipped.sword].critical : 20,
    def: stats.equipped.chestplate ? client.tools.Armor[stats.equipped.chestplate].defense : [1, 5],
    cdef: stats.equipped.helmet ? client.tools.Armor[stats.equipped.helmet].crit : [0.5, 0],
    sp: stats.speed + (stats.equipped.boots ? client.tools.Armor[stats.equipped.boots].speed : 0),
    luck: stats.luck,
    id: player.id
  }
  let res = { player: p, mob: ne }
  return res
}

async function win(stats, user, message, collector) {
        let xp = Math.floor(Math.random() * stats.mob.xp[1]) + stats.mob.xp[0]
        let reward = stats.mob.rewards.random()
        let inv = await db.fetch(`inventory_${user.id}`)
        inv.hunger -= 10
        inv.xp += xp;
        let drops = Math.random() < stats.mob.drops[1] ? stats.mob.drops[0] : ''
        if(drops) inv.crates.push(stats.mob.drops[0])
        console.log(inv)
        await db.set(`inventory_${user.id}`, inv)
        let winEmbed = new discord.MessageEmbed()
        .setTitle('You Win')
        .setColor('#206694')
        .setAuthor(user.username, user.displayAvatarURL())
        .setDescription(`You got ${reward}$ and ${xp} XP
${drops ? `You found a ${drops} Crate!\nUse\`s!crate ${drops}\` to open it!` : '' }`)
        message.channel.send(winEmbed)
        message.client.level(inv, message.channel, user)
        collector.stop();
        return;
}

async function lose(stats, user, message, collector) {
  message.channel.send('You lost')
  collector.stop();
  return;
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