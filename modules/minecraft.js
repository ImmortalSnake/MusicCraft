const db = require('quick.db');
const fetch = require('node-superfetch');

module.exports = (client) => class Minecraft {
  constructor(options) {

    this.db = client.db;
    this.tools = require('../assets/tools');
    this.items = require('../assets/items');
    this.mobs = require('../assets/mobs');
    this.shop = require('../assets/shop');
    this.inv = require('../models/player.js');
    this.Tools = this.tools.Tools;
    this.Food = this.items.Food;
    this.Materials = this.items.Materials;
    this.Armor = this.tools.Armor;
    this.Other = this.tools.Other;
    this.recipes = this.items.recipes;
    this.crates = this.tools.crates;
    this.exploreTimer = options.exploreTimer;
    this.rhunger = options.rhunger;
    this.villageTimer = options.villageTimer;
    this.codes = options.codes;

  }

  async set(data, val) {
    val.forEach(v => data.markModified(v));
    data.save();
  }

  async get(id) {
	const inv = await this.inv.findOne({ id: id });
	if(inv) return inv;
	else return false;
  }

  async checkInventory(user) {
		const inv = await this.get(user.id);
		const inventory = inv.inventory;
		if(!inventory) return { err: true };
		const def = this.defaultInventory;
		const keys = Object.keys(def);
		const values = Object.values(def);
		for(let i = 0; i < keys.length; i++) {
			if(!inventory[keys[i]]) {
				inventory[keys[i]] = values[i];
			}
			if(typeof values[i] !== typeof inventory[keys[i]]) {
				console.log(keys[i]);
			}
		}
		for(const t in inventory.tools) { if(!inventory.tools[t]) delete inventory.tools[t]; }
		for(const f in inventory.food) { if(!inventory.food[f]) delete inventory.food[f]; }
		return inv;
	}

  async create(id, actual) {
	const data = new this.inv({
		id: id,
		tools: this.convert(actual.tools) || [{ name: 'Wooden Axe', value: { durability: 60, Enchants: '' } }],
		equipped: this.convert(actual.equipped) || [{ name: 'axe', value: 'Wooden Axe' }],
		materials: this.convert(actual.materials) || [
			{ name: 'Wood', value: 0 },
			{ name: 'Stone', value: 0 },
			{ name: 'Dirt', value: 0 },
			{ name: 'Iron', value: 0 },
			{ name: 'Gold', value: 0 },
			{ name: 'Diamond', value: 0 }],
		armor: this.convert(actual.armor) || [],
		crates: [],
		food: this.convert(actual.food) || [],
		dimension: actual.dimension || 'Overworld',
		other: this.convert(actual.other) || [],
		money: await db.fetch(`balance_${id}`) || 0
	});
	data.save();
}

	async level(inventory, channel) {
		const lvl = inventory.level;
  	const nextlvl = 5 * (lvl ** 2) + 50 * lvl + 100;
		if(nextlvl <= lvl) {
			inventory.level++;
			// await db.set(`inventory_${user.id}`, inventory);
			channel.send(`Level Up! You are now in level **${inventory.level}**`);
		}
	}

  convert(data) {
	const arr = [];
	for(const k in data) {
		const temp = { name: k, value: data[k] };
		arr.push(temp);
	}
	return arr;
}

  find(name) {
	if(this.Tools[name]) return { name: 'tools', value: this.Tools[name] };
	if(this.Food[name]) return { name: 'food', value: this.Food[name] };
	if(this.Materials[name]) return { name: 'materials', value: this.Materials[name] };
	if(this.tools.Armor[name]) return { name: 'armor', value: this.Armor[name] };
	if(this.tools.Other[name]) return { name: 'other', value: this.Other[name] };
	return false;
}

  ishow(inventory, type) {
	const res = {};
	let m = '**';
	inventory[type.toLowerCase()].forEach(mat => {
		res[mat.name] = mat.value || 0;
	});
	for(const v in res) {
		let e;
		if(client.items[type]) e = this.items[type][v] ;
		else if(client.tools[type]) e = this.tools[type][v];
		if(!e) e = { emote: '' };
		let x = `x${res[v]}\n`;
		if(type === 'Tools' || type === 'Armor') x = ` | Durability ${res[v].durability}\n`;
		else if(typeof res[v] === 'object') x = 'x1\n'; // []
		m += `${v}${e.emote} ${x}`;
	}
	m += '**';
	return m;
}

  async getCode(query) {
    const codes = await fetch.get(this.codes);
    const code = codes.body[query];
    return code;
  }

exists(inventory, item) {
	for(const mat in item.materials) {
		const m = inventory.materials.find(x=>x.name === mat.toProperCase());
		const f = inventory.food.find(x=>x.name === mat.toProperCase());
		if(m && item.materials[mat] > m.value) return false;
		if(f && item.materials[mat] > f.value) return false;
	}
	return true;
}
  async reset(id) {
	this.inv.findOneAndDelete({ id: id })
		.then(() => console.log(`${id} was successfully remove from the database`));
}
};