const db = require('quick.db');
const discord = require('discord.js')
const playing = new Set;

exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have a hoe .Use the `s!start` command to get an hoe');
let user = message.mentions.members.first();
if(!user) return message.reply('Mention the user you want to fight with')
message.channel.send(user.user.username + ', Do you accept the fight?')
  .then(async m => {
    await m.react('✅');
    await m.react('❎');
    const collector = m.createReactionCollector(
      (reaction, u) => u.id == user.id,
            { time: 240000 });
    collector.on('collect', async (r) => {
      if(r.emoji.name == '❎'){
        message.channel.send(user.user + ' did not accept the fight');
        collector.stop();
      }
      else if(r.emoji.name == '✅') {
      let choice = Math.floor(Math.random() * 2);
      if(choice === 0) await moves(client, message, message.author, user.user);
        else await moves(client, message, user.user, message.author);
      collector.stop();
        }
    });
    collector.on('end', async (r) => {
      if(r.size == 0) return message.reply(user.user + ' did not accept the fight');
    });
  });
}

async function moves(client, message, user1, user2, stats) {
  let health1, attack1, health2, attack2;
  if(!stats) {
  let inventory1 = await db.fetch(`inventory_${user1.id}`)
  let inventory2 = await db.fetch(`inventory_${user2.id}`)
   health1 = inventory1.health;
   attack1 = inventory1.attack ;
   inventory1.equipped.sword ? attack1 += client.tools.Tools[inventory1.equipped.sword].dmg : attack1 = attack1;

   health2 = inventory2.health;
   attack2 = inventory2.attack;
  inventory2.equipped.sword ? attack2 += client.tools.Tools[inventory2.equipped.sword].dmg : attack2 = attack2;
}
  else {
    health1 = stats.hp1;
    attack1 = stats.dmg1;
    health2 = stats.hp2;
    attack2 = stats.dmg2;
  }

  let embed = new discord.MessageEmbed()
  .setTitle('FIGHT')
  .setColor('GREEN')
  .setAuthor(user1.username, user1.displayAvatarURL)
  .setDescription(`**Pick Your Move (Attack / Defend) ${user1}\n\n${user1} | Health: ${health1} Attack: ${attack1}\n\n${user2} | Health: ${health2} Attack: ${attack2}**`);
  message.channel.send(embed)
  .then(async m=> {
    await m.react('🇦');
    await m.react('🇩');
    const collector = m.createReactionCollector(
      (reaction, u) => u.id == user1.id,
            { time: 240000 });
    collector.on('collect', async (r) => {
      if(r.emoji.name == '🇦') {
        collector.stop();
   let success = 0;
  (Math.floor(health2 + Math.random() * 15) < Math.floor(attack1 + Math.random () * 15)) ? success++ : success--;
        if(success > 0) {
          stats = { hp2: health1, hp1: health2 - Math.ceil(Math.random() * attack1) - attack1, dmg2: attack1, dmg1: attack2 };
        } else {
          stats = { hp2: health1 - Math.ceil(health2 / 10), hp1: health2, dmg2: attack1, dmg1: attack2 };
        }
        if(stats.hp2 < 0) return win(message, user2, user1);
        else if(stats.hp1 < 0) return win(message, user1, user2);
        moves(client, message, user2, user1, stats);
      }
      else if(r.emoji.name == '🇩') {
        collector.stop();
      let success = 0;
       (Math.floor(attack2 + Math.random() * 15) < Math.floor(health1 + Math.random () * 15)) ? success++ : success--;
        if(success > 0) {
          stats = { hp2: health1, hp1: health2 - Math.ceil(Math.random() * attack1) - attack1, dmg2: attack1, dmg1: attack2 };
        } else {
          stats = { hp2: health1 - Math.ceil(attack2 / 10), hp1: health2, dmg2: attack1, dmg1: attack2 };
        }
        if(stats.hp2 <= 0) return win(message, user2, user1);
        else if(stats.hp1 <= 0) return win(message, user1, user2);
        moves(client, message, user2, user1, stats);
        }
    });
  });
}

function win(message, winner, loser) {
      let embed = new discord.MessageEmbed()
      .setTitle('Fight')
      .setColor('GREEN')
      .setAuthor(winner.username, winner.displayAvatarURL)
      .setDescription(`${winner} defeated ${loser}.`)
      .setFooter(loser.username, loser.displayAvatarURL);
      message.channel.send(embed);
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'pvp',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}