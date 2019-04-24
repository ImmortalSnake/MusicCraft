const db = require('quick.db');

exports.run = async (client, message) => {
  let inventory = await db.fetch(`inventory_${message.author.id}`);
  if(!inventory) return message.channel.send('You do not have an axe .Use the `s!start` command to get an axe');
  if(inventory.dimension === 'Nether') return message.channel.send('You cant chop wood in the Nether! Use `s!dim overworld` to go back to the overworld');
  if(inventory.hunger <= 5) return message.channel.send('You are too hungry. Use `s!cook [item]` to cook food and get more energy and health. Use `s!eat [item]` to eat food or wait until your hunger reaches back to 100');

  inventory = await client.checkInventory(message.author);
  if(Date.now() - inventory.lastactivity >= client.utils.rhunger && inventory.hunger < 75) inventory.hunger += 25;
  if(inventory.hunger %2 == 0 && inventory.hunger <= 25) await message.channel.send('You are getting hungry. To get food use `s!craft wooden hoe` to craft a hoe and `s!farm` to get food. Use `s!cook [item]` to cook food and get more energy and health. Use `s!eat [item]` to eat food');
  let eaxe = inventory.equipped.axe;
  if(inventory.tools[eaxe].durability < 1) return message.channel.send(`You cannot use this axe anymore as it is broken, please use \`s!repair ${eaxe}\` to repair it`);
  inventory.hunger -= 0.25;
  let axe = client.tools.Tools[eaxe];
  let drops = Math.floor(Math.random() * axe.drops[1]) + axe.drops[0];
  let wood = client.items.Materials.Wood;
  inventory.materials.Wood = inventory.materials.Wood + drops;
  inventory.tools[eaxe].durability--;

  let apple = false;
  let m = '';
  let rand = Math.random();
  if( rand > .9) apple = true;
  if(apple){
    inventory.food['Apple'] ? inventory.food['Apple']++ : inventory.food['Apple'] = 1;
    m = `\n You found an Apple ${client.items.Food['Apple'].emote}`;
  }
  inventory.lastactivity = Date.now();
  await db.set(`inventory_${message.author.id}`, inventory);
  let embed = client.embed(message)
    .setTitle('Chop')
    .setDescription(`**${message.author.username} chopped wood with ${axe.emote}
You got ${drops} ${wood.emote}.${m}**`);
  message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  cooldown: 5000
};

exports.help = {
  name: 'chop',
  description: 'Chop trees to get wood! Apple drops ocassionaly',
  group: 'economy',
  usage: 'chop',
};