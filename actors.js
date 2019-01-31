const armour = require("./armour.js");
const weapon = require("./weapons.js");

class Actor{
	constructor(){
		this.party;
		this.registry;
		this.name = "Wiseguy";
		this.controlledByPlayer = false;
		this.max = {
			hp:1,
			stealth: 0,
			strength: 0,
			shooting: 0,
			charm: 0
		};
		this.current = this.max;
		this.broodiness = 0;
		this.wanderlust = 0;
		this.chumminess = 0;
		this.independence = 0;
		this.danger = 0;
		this.aggro = 0;
		this.act;
		this.faction = 0;
		this.affinity = [];
		for(let i = 0; i < 25; i++){
			this.affinity.push(true);
		};
		this.inventory = {
			weapons: {
				weapon1: weapon.weapons[0],
				weapon2: weapon.weapons[2],
				grenades: 0,
				maxgrenades: 4,
				ammo: [0,0,10]
			},
			cash: {
				components: 0,
				scrap: 0
			},
			rations: 0,
			armour: armour.armour[0],
			secret: []
		};
		this.quests = [];
		this.newInfo = {
			attack: [], // who YOU attacked {index: actor index num, hit: true or false, priority: 0}
			defend: [], // who attacked YOU {index: actor index num, hit: true or false, priority: 0}
			neighbours: [], // who have you just seen for the first time {index: party index num, priority: 1}
			departures: [], // who has left the cell, and in which direction {index: party index num, dir: direction, priority: 1}
			casualties: [], // who has died in this update
			misc: [], //
			distrib: function(){

			}
		};
		this.visibleNeighbours = [];
	}
	updateRegistry(num){
		this.registry = num;
	}
}

class Goodguy extends Actor{
	constructor(){
		super();
		this.name = "Goodguy";
		this.controlledByPlayer = true;
		this.distrib = function(){

		}
	}
}

class Badguy extends Actor{
	constructor(){
		super();
		this.name = "Badguy";
	}
}

//============================================================
//======================     HUMANS     ======================
//============================================================
 
 class Human extends Actor{
 	constructor(){
 		super();
 		this.name = "Human";
 	}
 }


module.exports = {
	Actor,
	Goodguy,
	Badguy
}