const db = require('quick.db')
const discord = require('discord.js')
exports.run = async (client, message, args) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`)
  if(!inventory) return message.channel.send('You do not have a player .Use the `s!start` command to get a player');
  await client.checkInventory(message.author)
  let user = message.mentions.members.first();
  if(!user){
    switch(args[0].toLowerCase()) {
      case 'add': {
        let trade = inventory.trade.trades;
        if(!inventory.trade.trades) return message.channel.send('You are not in a trade with anyone. Use `s!trade [@user]` to start trading!')
        let item = args.slice(1).join(' ').split('-')[0].trim().toProperCase();
        let amount = parseInt(args.join(' ').split('-')[1]) || 1;
        if(!item) return message.channel.send('Use `s!trade add [item] -[amount]` to add materials or food to the trade');
        let locate = await ifind(client, item, inventory);
        console.log(item, amount)
        if(!locate[0]) return message.channel.send('Could not find that item in your inventory');
        let total = trade.give[item] ? trade.give[item] + amount : amount
        if(total > locate[1]) return message.channel.send('You do not have that many items in your inventory')
        trade.give[item] ? inventory.trade.trades.give[item] += amount : inventory.trade.trades.give[item] = amount
        await db.set(`inventory_${message.author.id}`, inventory)
        break;
      }
      case 'remove': {
        if(!inventory.trade.trades) return message.channel.send('You are not in a trade with anyone. Use `s!trade [@user]` to start trading!')
        let item = args.slice(1).join(' ').split('-')[0].trim()
        break;
      }
      case 'info': {
        if(!inventory.trade.trades) return message.channel.send('You are not in a trade with anyone. Use `s!trade [@user]` to start trading!')
        break;
      }
      case 'confirm': {
        if(!inventory.trade.trades) return message.channel.send('You are not in a trade with anyone. Use `s!trade [@user]` to start trading!')
        break;
      }
      case 'cancel': {
        if(!inventory.trade.trades) return message.channel.send('You are not in a trade with anyone. Use `s!trade [@user]` to start trading!')
        
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
  const collector = m.createReactionCollector(
      (reaction, u) => u.id == user.user.id,
            { time: 240000 });
  collector.on('collect', async (r) => {
    if(r.emoji.name == '❎'){
        message.reply(user.user.username + ' did not accept the trade request');
        collector.stop();
        return;
      }
      else if(r.emoji.name == '✅') {
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
  message.channel.send(cembed)
  let deftrade1 = {
    user: user.id,
    recieve: {},
    give: {}
  }
  let deftrade2 = {
    user: message.author.id,
    recieve: {},
    give: {}
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
    return [client.items.food[item], f]
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