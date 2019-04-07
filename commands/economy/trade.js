const db = require('quick.db')
const discord = require('discord.js')

exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have a player .Use the `s!start` command to get a player');
  inventory = await client.checkInventory(message.author)
  if(!args[0]) return message.channel.send('Mention the user you want to trade with')
  let user = message.mentions.members.first();
  if(!user){
    switch(args[0].toLowerCase()) {
      case 'add': {
        let trade = inventory.trade.trades;
        if(!inventory.trade.trades) return message.channel.send('You are not in a trade with anyone. Use `s!trade [@user]` to start trading!');
        if(trade.confirmed) return message.channel.send('You have already confirmed the trade use `s!trade cancel` to cancel this trade')
        let item = args.slice(1).join(' ').split('-')[0].trim().toProperCase();
        let amount = parseInt(args.join(' ').split('-')[1]) || 1;
        if(!item) return message.channel.send('Use `s!trade add [item] -[amount]` to add materials or food to the trade');
        let locate = await ifind(client, item, inventory);
        if(item == 'Money') locate = [{ emote: ':dollar:' }, await db.fetch(`balance_${message.author.id}`)]
        if(!locate[0]) return message.channel.send('Could not find that item in your inventory');
        let total = trade.give[item] ? trade.give[item] + amount : amount
        if(total > locate[1]) return message.channel.send('You do not have that many items in your inventory or balance')
        trade.give[item] ? inventory.trade.trades.give[item] += amount : inventory.trade.trades.give[item] = amount
        await db.set(`inventory_${message.author.id}`, inventory)
        let aembed = new discord.MessageEmbed()
          .setTitle('Trade Add')
          .setColor('#206694')
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`**Successfully added ${item} ${locate[0].emote} x${amount} to the trade**`)
        return message.channel.send(aembed)
        break;
      }
      case 'remove': {
        let trade = inventory.trade.trades;
        if(!trade) return message.channel.send('You are not in a trade with anyone. Use `s!trade [@user]` to start trading!')
        if(trade.confirmed) return message.channel.send('You have already confirmed the trade use `s!trade cancel` to cancel this trade')
        let item = args.slice(1).join(' ').toProperCase();
        if(!trade.give[item]) return message.channel.send('That item is not in the trade. Use `s!trade add [item] -[amount]` to add materials or food to the trade')
        inventory.trade.trades.give[item] = 0
        await db.set(`inventory_${message.author.id}`, inventory)
        let rembed = new discord.MessageEmbed()
          .setTitle('Trade Remove')
          .setColor('#206694')
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`**Successfully removed ${item} from the trade**`)
        return message.channel.send(rembed)
        break;
      }
      case 'info': {
        let trade = inventory.trade.trades;
        if(!trade) return message.channel.send('You are not in a trade with anyone. Use `s!trade [@user]` to start trading!')
        let trade2 = await db.fetch(`inventory_${trade.user}`).trade.trades
        let trader = client.users.get(trade.user)
        let g = `**`
        let r = `**`
        let res = {}
        let foo = {}
        for(const c in trade.give) {
          res[c] = trade.give[c] || 0
        }
        for(const v in res) {
          let e = client.items.Materials[v] || client.tools.Tools[v] || client.items.Food[v] || { emote: ':dollar:'}
          g += `${v}${e.emote} x${res[v]}\n`
        }
        /////////////////////////////////////////////////////////
        for(const c in trade2.give) {
          foo[c] = trade2.give[c] || 0
        }
        for(const v in foo) {
          let e = client.items.Materials[v] || client.tools.Tools[v] || client.items.Food[v] || { emote: ':dollar:'}
          r += `${v}${e.emote} x${foo[v]}\n`
        }
        g += `**`
        r += `**`
        let iembed = new discord.MessageEmbed()
          .setTitle('Trade Info')
          .setColor('#206694')
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .addField('You are giving', g)
          .addField('You will recieve', r)
          .setFooter(trader.tag, trader.displayAvatarURL())
        message.channel.send(iembed)
        break;
      }
      case 'confirm': {
        let trade = inventory.trade.trades;
        if(!trade) return message.channel.send('You are not in a trade with anyone. Use `s!trade [@user]` to start trading!')
        let trade2 = await db.fetch(`inventory_${trade.user}`).trade.trades
        let trader = client.users.get(trade.user)
        let g = `**`
        let r = `**`
        let res = {}
        let foo = {}
        for(const c in trade.give) {
          res[c] = trade.give[c] || 0
        }
        for(const v in res) {
          let e = client.items.Materials[v] || client.tools.Tools[v] || client.items.Food[v] || { emote: ':dollar:'}
          g += `${v}${e.emote} x${res[v]}\n`
        }
        /////////////////////////////////////////////////////////
        for(const c in trade2.give) {
          foo[c] = trade2.give[c] || 0
        }
        for(const v in foo) {
          let e = client.items.Materials[v] || client.tools.Tools[v] || client.items.Food[v] || { emote: ':dollar:'}
          r += `${v}${e.emote} x${foo[v]}\n`
        }
        g += `**`
        r += `**`
        let iembed = new discord.MessageEmbed()
          .setTitle('Confirm Trade')
          .setColor('#206694')
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .addField('You are giving', g)
          .addField('You will recieve', r)
          .setDescription(`**Do you wish to confirm the trade with ${trader.tag}
React with ✅ to confirm the trade**`)
          .setFooter(trader.tag, trader.displayAvatarURL())
        let m = await message.channel.send(iembed)
        await m.react('✅')
        await m.react('❎')
       const collector = m.createReactionCollector((reaction, u) => u.id == message.author.id);
       collector.on('collect', async (r) => {
         if(r.emoji.name == '❎'){
           message.reply('did not confirm the trade');
           collector.stop();
           return;
         }
         else if(r.emoji.name == '✅') {
           let inventory2 = await db.fetch(`inventory_${trade.user}`)
           let bal = await db.fetch(`balance_${message.author.id}`)
           let bal2 = await db.fetch(`balance_${trade.user}`)
           if(inventory2.trade.trades.confirmed) {
              for(const v in res) {
                if(v === 'Money' && bal >= res[v]) {
                  await db.subtract(`balance_${message.author.id}`, res[v]);
                  await db.add(`balance_${trade.user}`, res[v]);
                  continue;
                }
                if(inventory.materials[v] && inventory.materials[v] >= res[v]){ 
                  inventory.materials[v] -= res[v]
                  inventory2.materials[v] ? inventory2.materials[v] += res[v] : inventory2.materials[v] = res[v]
                }
                if(inventory.tools[v] && inventory.tools[v] >= res[v]){
                  inventory.tools[v] -= res[v]
                  inventory2.tools[v] ? inventory2.tools[v] += res[v] : inventory2.tools[v] = res[v]
                }
                if(inventory.food[v] && inventory.food[v] >= res[v]){ 
                  inventory.food[v] -= res[v]
                  inventory2.food[v] ? inventory2.food[v] += res[v] : inventory2.food[v] = res[v]
                }
              
              }
            for(const t in foo) {
                if(t === 'Money' && bal2 >= foo[t]) {
                  await db.add(`balance_${message.author.id}`, foo[t]);
                  await db.subtract(`balance_${trade.user}`, foo[t]);
                  continue;
                }
                if(inventory2.materials[t] && inventory2.materials[t] >= foo[t]){ 
                  inventory2.materials[t] -= foo[t]
                  inventory.materials[t] ? inventory.materials[t] += foo[t] : inventory.materials[t] = foo[t]
                }
                if(inventory2.tools[t] && inventory2.tools[t] >= foo[t]){
                  inventory2.tools[t] -= foo[t]
                  inventory.tools[t] ? inventory.tools[t] += foo[t] : inventory.tools[t] = foo[t]
                }
                if(inventory2.food[t] && inventory2.food[t] >= foo[t]){ 
                  inventory2.food[t] -= foo[t]
                  inventory.food[t] ? inventory.food[t] += foo[t] : inventory.food[t] = foo[t]
                }
              }
           inventory.trade = {}
           inventory2.trade = {}
          await db.set(`inventory_${message.author.id}`, inventory)
          await db.set(`inventory_${trade.user}`, inventory2)
             return message.channel.send(`The trade between <@${message.author.id}> and <@${trade.user}> was completed!`)
           }
           inventory.trade.trades.confirmed = true
           await db.set(`inventory_${message.author.id}`, inventory)
           return message.channel.send(`<@${message.author.id}> confirmed! Waiting confirmation from <@${trade.user}>`)
         }
       })
        break;
      }
      case 'cancel': {
        let trade = inventory.trade.trades;
        if(!trade) return message.channel.send('You are not in a trade with anyone. Use `s!trade [@user]` to start trading!')
        let trader = client.users.get(trade.user)
        let confirmEmbed = new discord.MessageEmbed()
          .setTitle('Cancel Trade')
          .setColor('#206694')
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setFooter(trader.tag, trader.displayAvatarURL())
          .setDescription(`**Do you wish to cancel the trade with ${trader.tag}
React with ✅ to cancel the trade**`)
        let m = await message.channel.send(confirmEmbed)
        await m.react('✅')
        await m.react('❎')
       const collector = m.createReactionCollector((reaction, u) => u.id == message.author.id);
       collector.on('collect', async (r) => {
         if(r.emoji.name == '❎'){
           message.channel.send('Trade was not cancelled');
           collector.stop();
           return;
         }
         else if(r.emoji.name == '✅') {
           let inventory2 = await db.fetch(`inventory_${trade.user}`)
           inventory.trade = {}
           inventory2.trade = {}
          await db.set(`inventory_${message.author.id}`, inventory)
          await db.set(`inventory_${trade.user}`, inventory2)
          return message.channel.send(`The trade between <@${message.author.id}> and <@${trade.user}> was cancelled by <@${message.author.id}>`)
         }
       })
        break;
      }
      default: {
        message.channel.send('Mention the user you want to trade with')
        break;
      }
    }
  }else{
  if(inventory.trade.trades) return message.channel.send('You are already in a trade with someone else')
  if(user.id === message.author.id) return message.channel.send('You cant trade with yourself')
  let inventory2 = await db.fetch(`inventory_${user.id}`)
  if(!inventory2) return message.channel.send('That user does not have a player.');
  await client.checkInventory(user.user)
  if(inventory2.trade.trades) return message.channel.send(user.user.username+ ' is already in a trade with someone else')
  let embed = new discord.MessageEmbed()
  .setTitle('Trade Request')
  .setColor('#206694')
  .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`**${user.user.username}, You have recieved a trade request from ${message.author.username}**
React to confirm or deny the trade request`)
  .setFooter(user.user.tag, user.user.displayAvatarURL())
  let m = await message.channel.send(embed)
  await m.react('✅')
  await m.react('❎')
  const collector = m.createReactionCollector((reaction, u) => u.id == user.user.id,);
  collector.on('collect', async (r) => {
    if(r.emoji.name == '❎'){
        message.reply(user.user.username + ' did not accept the trade request');
        collector.stop();
        return;
      }
      else if(r.emoji.name == '✅') {
  inventory2 = await db.fetch(`inventory_${user.id}`)
  if(inventory2.trade.trades) return message.channel.send(user.user.username+ ' is already in a trade with someone else')
  let cembed = new discord.MessageEmbed()
  .setTitle('Trade Request Confirmed')
  .setColor('#206694')
  .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`**${user.user.username}, confirmed the trade request from ${message.author.username}**
Use \`s!trade add [item] -[amount]\` to add materials or food to the trade
Use \`s!trade remove [item]\` to remove materials or food to trade
Use \`s!trade info\` to view the current trade
Use \`s!trade confirm\` to confirm
Use \`s!trade cancel\` to cancel the trade`)
  .setFooter(user.user.tag, user.user.displayAvatarURL())
 await message.channel.send(`The trade request sent by <@${message.author.id}> was accepted by <@${user.id}>`)
    message.channel.send(cembed)
  let deftrade1 = {
    user: user.id,
    give: {},
    confirmed: false
  }
  let deftrade2 = {
    user: message.author.id,
    give: {},
    confirmed: false
  } 
  inventory.trade.trades = deftrade1
  inventory2.trade.trades = deftrade2
  await db.set(`inventory_${message.author.id}`, inventory)
  await db.set(`inventory_${user.id}`, inventory2)
  collector.stop();
      }
  })
 /* let item = args.slice(1).join(' ').split('-')[0].trim()
  if(!item) return message.channel.send('Please specify what you want to trade')
  let number = args.slice(1).join(' ').split('-')[1].trim() || 1;
  console.log(item, number)*/
  }
}

async function ifind(client, item, inventory) {
  let mat = inventory.materials[item]
  let t = inventory.tools[item]
  let f = inventory.food[item]
  if(mat && mat > 0) {
    return [client.items.Materials[item], mat]
  }
  else if(t && t > 0) {
    return [client.tools.Tools[item], t]
  }
  else if(f && f > 0) {
    return [client.items.Food[item], f]
  }
  else return false;
}

exports.conf = {
  aliases: [],
  enabled: true,
  guildOnly: true
};

// Name is the only necessary one.
exports.help = {
  name: 'trade',
  description: 'Evaluates a JS code.',
  group: 'economy',
  usage: 'coin [command]'
}
