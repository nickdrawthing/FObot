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
			misc: [] //
		};
		this.info = {
			visibleNeighbours: [],
			visibleItems: [],
			visibleContainers: [],
			visibleLairs: []
		}
		this.oauth = null;
		this.distribFuncVal = 0;
		this.visibleNeighbours = [];
	}
	updateRegistry(num){
		this.registry = num;
	}
}

var distribFuncs = [
	function(oauth,input){

	},
	function(oauth,input){
		var reportString = createReportString(input);
		console.log(reportString); 
	},
	function(oauth,input){
		var reportString = createReportString(input);
		//tweet that shit
	}
];

function createReportString(input){
	var txtPrs = require("./text_parser.js");
	var reportString = "BLANK";
	//var attackedList = //create string of names of who you attacked
	//if attackedList != "" then concat "You were attacked by " and then the attackedList
	//repeat this process for defend, neighbours, departures, and casualties
	//concat misc strings as-is
	return reportString;
}

class Goodguy extends Actor{
	constructor(){
		super();
		this.name = "Goodguy";
		this.controlledByPlayer = true;
		this.distribFuncVal = 1;
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
	Badguy,
	distribFuncs
}