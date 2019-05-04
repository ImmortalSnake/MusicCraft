const db = require('quick.db');

module.exports.createInv = async (client, message, actual) => {
  const data = new client.inv({
    id: message.author.id,
    tools: convert(actual.tools) || [{name: 'Wooden Axe', value: {durability: 60, Enchants: ''} }],
    equipped: convert(actual.equipped) || [{name: 'axe', value: 'Wooden Axe'}],
    materials: convert(actual.materials) || [{name: 'Wood', value: 0},
                                             {name: 'Stone', value: 0},
                                             {name: 'Dirt', value: 0},
                                             {name: 'Iron', value: 0},
                                             {name: 'Gold', value: 0},
                                             {name: 'Diamond', value: 0}],
    armor: convert(actual.armor) || [],
    crates: [],
    food: convert(actual.food) || [],
    dimension: actual.dimension || 'Overworld',
    other: convert(actual.other) || [],
    money: await db.fetch(`balance_${message.author.id}`) || 0
  });
  data.save();
};

module.exports.setInv = async (data, val) => {
  val.forEach(v => data.markModified(v));
  data.save();
};

module.exports.getInv = async (client, id) => {
  let inv = await client.inv.findOne({id: id});
  if(inv) return inv;
  else return false;
};

module.exports.reset = async(client, id) => {
  client.inv.findOneAndDelete({id: id})
    .then(() => console.log(`${id} was successfully remove from the database`));
};

function convert(data) {
  const arr = [];
  for( const k in data) {
    const temp = { name: k, value: data[k]};
    arr.push(temp);
  }
}