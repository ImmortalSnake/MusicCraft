const db = require('quick.db');
const discord = require('discord.js');

exports.run = async (client, message, args) => {
  let inventory = await client.db.getInv(client, message.author.id);
  if(!inventory) return message.channel.send('You do not have a player. Use the `s!start` command to start');
  if(!args[0]) return message.channel.send('Mention the user you want to trade with or if you already in a trade use `s!trade [option]`');
  let user = message.mentions.members.first();
  if(!user){
    const trade = inventory.trade[0];
    if(!trade) return message.channel.send('You are not in a trade with anyone. Use `s!trade [@user]` to start trading!');
    const user2 = await client.db.getInv(client, trade.user);
    const trade2 = user2.trade[0];

    switch(args[0].toLowerCase()) {
      case 'add': {
        if(trade.confirmed) return message.channel.send('You have already confirmed the trade use `s!trade cancel` to cancel this trade');
        let item = args.slice(1).join(' ').split('-')[0].trim().toProperCase();
        let amount = parseInt(args.join(' ').split('-')[1]) || 1;
        if(!item) return message.channel.send('Use `s!trade add [item] -[amount]` to add materials or food to the trade');
        let locate = await ifind(client, item, inventory);
        if(item === 'Money') locate = [{ emote: ':dollar:' }, inventory.money];
        if(!locate[0]) return message.channel.send('Could not find that item in your inventory');
        let total = trade.give[0][item] ? trade.give[0][item] + amount : amount;
        if(total > locate[1]) return message.channel.send('You do not have that many items in your inventory or balance');
        trade.give[0][item] ? inventory.trade[0].give[0][item] += amount : inventory.trade[0].give[0][item] = amount;
        await client.db.setInv(inventory, ['trade']);
        let aembed = client.embed(message, {title: '**Trade Add**'})
          .setDescription(`**Successfully added ${item} ${locate[0].emote} x${amount} to the trade**`);
        return message.channel.send(aembed);
      }
      case 'remove': {
        if(trade.confirmed) return message.channel.send('You have already confirmed the trade use `s!trade cancel` to cancel this trade');
        let item = args.slice(1).join(' ').toProperCase();
        if(!trade.give[0][item]) return message.channel.send('That item is not in the trade. Use `s!trade add [item] -[amount]` to add materials or food to the trade');
        delete inventory.trade[0].give[0][item];
        await client.db.setInv(inventory, ['trade']);
        let rembed = client.embed(message, {title: '**Trade Remove**'})
          .setDescription(`**Successfully removed ${item} from the trade**`);
        return message.channel.send(rembed);
      }
      case 'info': {
        let trader = client.users.get(trade.user);
        let g= '**';
        let r= '**';
        let res = {};
        let foo = {};
        for(const c in trade.give[0]) {
          res[c] = trade.give[0][c] || 0;
        }
        for(const v in res) {
          let e = client.items.Materials[v] || client.tools.Tools[v] || client.items.Food[v] || { emote: ':dollar:'};
          g += `${v}${e.emote} x${res[v]}\n`;
        }
        for(const c in trade2.give[0]) {
          foo[c] = trade2.give[0][c] || 0;
        }
        for(const v in foo) {
          let e = client.items.Materials[v] || client.tools.Tools[v] || client.items.Food[v] || { emote: ':dollar:'};
          r += `${v}${e.emote} x${foo[v]}\n`;
        }
        g += '**';
        r += '**';
        let iembed = client.embed(message, {title: '**Trade Info**'})
          .addField('You are giving', g)
          .addField('You will recieve', r)
          .setFooter(trader.tag, trader.displayAvatarURL());
        message.channel.send(iembed);
        break;
      }
      case 'confirm': {
        let trader = client.users.get(trade.user);
        let g = '**';
        let r = '**';
        let res = {};
        let foo = {};
        for(const c in trade.give[0]) {
          res[c] = trade.give[0][c] || 0;
        }
        for(const v in res) {
          let e = client.items.Materials[v] || client.tools.Tools[v] || client.items.Food[v] || { emote: ':dollar:'};
          g += `${v}${e.emote} x${res[v]}\n`;
        }

        for(const c in trade2.give[0]) {
          foo[c] = trade2.give[0][c] || 0;
        }
        for(const v in foo) {
          let e = client.items.Materials[v] || client.tools.Tools[v] || client.items.Food[v] || { emote: ':dollar:'};
          r += `${v}${e.emote} x${foo[v]}\n`;
        }
        g += '**';
        r += '**';
        let iembed = client.embed(message, {title: '**Trade Info**'})
          .addField('You are giving', g)
          .addField('You will recieve', r)
          .setDescription(`**Do you wish to confirm the trade with ${trader.tag}
React with ✅ to confirm the trade**`)
          .setFooter(trader.tag, trader.displayAvatarURL());
        let m = await message.channel.send(iembed);
        await m.react('✅');
        await m.react('❎');
       const collector = m.createReactionCollector((reaction, u) => u.id === message.author.id);
       collector.on('collect', async (r) => {
         if(r.emoji.name === '❎'){
           message.reply('did not confirm the trade');
           collector.stop();
           return;
         }
         else if(r.emoji.name === '✅') {
           let inventory2 = user2;
           if(inventory2.trade[0].confirmed) {
              for(const v in res) {
                if(v === 'Money' && inventory.money >= res[v]) {
                  inventory.money -= res[v];
                  inventory2.money += res[v];
                  continue;
                }
                if(inv(inventory, 'materials', v) && inv(inventory, 'materials', v).value >= res[v]){
                  inv(inventory, 'materials', v).value -= res[v];
                  inv(inventory2, 'materials', v) ? inv(inventory2, 'materials', v).value += res[v] : inv(inventory2, 'materials', v).value = res[v];
                }
                if(inv(inventory, 'food', v) && inv(inventory, 'food', v).value >= res[v]){
                  inv(inventory, 'food', v).value -= res[v]
                  inv(inventory2, 'food', v) ? inv(inventory2, 'food', v).value += res[v] : inv(inventory2, 'food', v).value = res[v]
                }
              }
            for(const t in foo) {
                if(t === 'Money' && inventory2.money >= foo[t]) {
                  inventory.money += foo[t];
                  inventory2.money -= foo[t];
                  continue;
                }
                if(inv(inventory2, 'materials', t) && inv(inventory2, 'materials', t).value >= foo[t]){
                  inv(inventory2, 'materials', t).value -= foo[t];
                  inv(inventory, 'materials', t) ? inv(inventory, 'materials', t).value += foo[t] : inv(inventory, 'materials', t).value = foo[t];
                }
                if(inv(inventory2, 'food', t) && inv(inventory2, 'food', t).value >= foo[t]){
                  inv(inventory2, 'food', t).value -= foo[t]
                  inv(inventory, 'food', t) ? inv(inventory, 'food', t).value += foo[t] : inv(inventory, 'food', t).value = foo[t]
                }
              }
           inventory.trade = inventory2.trade = []
          await client.db.setInv(inventory, ['trade', 'materials', 'food']);
          await client.db.setInv(inventory2, ['trade', 'materials', 'food']);
          return message.channel.send(`The trade between <@${message.author.id}> and <@${trade.user}> was completed!`)
           }
           inventory.trade[0].confirmed = true
           await client.db.setInv(inventory, ['trade']);
           return message.channel.send(`<@${message.author.id}> confirmed! Waiting confirmation from <@${trade.user}>
Please use \`s!trade confirm\` again to confirm!`);
         }
       });
        break;
      }
      case 'cancel': {
        let trader = client.users.get(trade.user);
        let confirmEmbed = client.embed(message, {title: '**Cancel Trade**'})
          .setFooter(trader.tag, trader.displayAvatarURL())
          .setDescription(`**Do you wish to cancel the trade with ${trader.tag}
React with ✅ to cancel the trade**`);
        let m = await message.channel.send(confirmEmbed);
        await m.react('✅');
        await m.react('❎');
       const collector = m.createReactionCollector((reaction, u) => u.id === message.author.id);
       collector.on('collect', async (r) => {
         if(r.emoji.name === '❎'){
           message.channel.send('Trade was not cancelled');
           collector.stop();
           return;
         }
         else if(r.emoji.name === '✅') {
          inventory.trade = user2.trade = [];
          await client.db.setInv(inventory, ['trade']);
          await client.db.setInv(user2, ['trade']);
          return message.channel.send(`The trade between <@${message.author.id}> and <@${trade.user}> was cancelled by <@${message.author.id}>`);
         }
       });
        break;
      }
      default: {
        return message.channel.send('Mention the user you want to trade with');
      }
    }
  }else{
    if(inventory.trade[0]) return message.channel.send('You are already in a trade with someone else');
    if(user.id === message.author.id) return message.channel.send('You cant trade with yourself');
    let inventory2 = await client.db.getInv(client, user.id);
    if(!inventory2) return message.channel.send('That user does not have a player.');

    if(inventory2.trade[0]) return message.channel.send(user.user.username+ ' is already in a trade with someone else');
    let embed = client.embed(message, {title: '**Trade Request**'})
      .setDescription(`**${user.user.username}, You have recieved a trade request from ${message.author.username}**
React to confirm or deny the trade request`)
      .setFooter(user.user.tag, user.user.displayAvatarURL());
    let m = await message.channel.send(embed);
    await m.react('✅');
    await m.react('❎');
    const collector = m.createReactionCollector((reaction, u) => u.id === user.user.id);
    collector.on('collect', async (r) => {
      if(r.emoji.name === '❎'){
        message.reply(user.user.username + ' did not accept the trade request');
        collector.stop();
        return;
      }
      else if(r.emoji.name === '✅') {
        inventory2 = await client.db.getInv(client, user.id);
        if(inventory2.trade[0]) return message.channel.send(user.user.username+ ' is already in a trade with someone else');
        let cembed = client.embed(message, {title: '**Trade Request Accepted**'})
          .setDescription(`**${user.user.username}, confirmed the trade request from ${message.author.username}**
Use \`s!trade add [item] -[amount]\` to add materials or food to the trade
Use \`s!trade remove [item]\` to remove materials or food to trade
Use \`s!trade info\` to view the current trade
Use \`s!trade confirm\` to confirm
Use \`s!trade cancel\` to cancel the trade`)
          .setFooter(user.user.tag, user.user.displayAvatarURL());
        await message.channel.send(`The trade request sent by <@${message.author.id}> was accepted by <@${user.id}>`);
        message.channel.send(cembed);
        let deftrade1 = {user: user.id, give: [{}], confirmed: false};
        let deftrade2 = {user: message.author.id, give: [{}], confirmed: false};
        inventory.trade[0] = deftrade1;
        inventory2.trade[0] = deftrade2;
        await client.db.setInv(inventory, ['trade']);
        await client.db.setInv(inventory2, ['trade']);
        collector.stop();
      }
    });
  }
};

async function ifind(client, item, inventory) {
  let mat = inventory.materials.find(x=>x.name===item);
  let f = inventory.food.find(x=>x.name===item);
  if(mat && mat.value > 0) {
    return [client.items.Materials[item], mat.value];
  }
  else if(f && f.value > 0) {
    return [client.items.Food[item], f.value];
  }
  else return false;
}

function inv(inventory, locate, n){
  return inventory[locate].find(x=>x.name===n);
}
exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

exports.help = {
  name: 'trade',
  description: 'Trade materials and money with other users!',
  group: 'economy',
  usage: 'trade [@user]'
};
