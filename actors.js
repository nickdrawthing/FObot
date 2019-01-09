const armour = require("./armour.js");
const weapon = require("./weapons.js");

class Actor{
	constructor(){
		this.maxHP = 1;
		this.hp = this.maxHP;
		this.name = "Wiseguy";
		this.controlledByPlayer = false;
		this.act;
		this.faction = 0;
		this.affinity = [];
		for(let i = 0; i < 25; i++){
			// this.affinity.push(true);
		}
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
			armour: armour.armour[0]
		}
	}
}

class Goodguy extends Actor{
	constructor(){
		super();
		this.name = "Goodguy";
		this.controlledByPlayer = true;
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