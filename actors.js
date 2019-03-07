const armour = require("./armour.js");
const weapon = require("./weapons.js");

function newInfoBlank() { 
	return {
		attack: [], // who YOU attacked {index: actor index num, hit: true or false, priority: 0}
		defend: [], // who attacked YOU {index: actor index num, hit: true or false, priority: 0}
		moved: [], // what direction you moved {moveDir: [x,y]}
		neighbours: [], 
		// who have you just seen for the first time 
		//{name: string, registry: arrayVal, party: party index num, hostile: true, priority: 1}
		departures: [], // who has left the cell, and in which direction 
		//{name: string, registry: arrayVal, party: party index num, priority: 1}
		casualties: [], // who has died in this update
		misc: [] //
	};
};

class Actor{
	constructor(){
		this.mapLoc = [null,null];
		this.party;
		this.registry;
		this.name = "Wiseguy";
		this.controlledByPlayer = false;
		this.max = {
			hp:1,
			stealth: 0.5,
			strength: 0.5,
			shooting: 0.5,
			charm: 0.5,
			perception: 0.5,
			sneak: 0.5
		};
		this.current = this.max;
		this.broodiness = 0.5;
		this.wanderlust = 0.5;
		this.chumminess = 0.5;
		this.independence = 0.5;
		this.danger = 0.5;
		this.aggro = 0.5;
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
		this.newInfo = newInfoBlank();
		this.knownInfo = {neighbours:[]};
		this.oauth = null;
		this.distribFuncVal = 0;
		this.visibleNeighbours = [];
	}
	updateRegistry(num){
		this.registry = num;
	}
};

var distribFuncs = [
	function(oauth,input){

	},
	function(oauth,input){
		console.log("GOT THIS FAR");
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
	var reportString = "";

	// attack
	if (input.attack.length > 0){
		var attackStringArray = [];
		for (let thisAttack of input.attack){
			var thisAttackStringItem = "You";
			thisAttackStringItem += (thisAttack.hit ? " hit " : " missed ");
			thisAttackStringItem += "the " + thisAttack.enemy;
			thisAttackStringItem += " with your " + thisAttack.weapon;
			attackStringArray.push(thisAttackStringItem);
		}
		reportString += txtPrs.makeReadable(txtPrs.listifyStringArray(attackStringArray)) + "!\n";

	}

	// defend
	if (input.defend.length > 0){
		var attackStringArray = [];
		for (let thisAttack of input.defend){
			var thisAttackStringItem = "a ";
			thisAttackStringItem += thisAttack.enemy;
			thisAttackStringItem += (thisAttack.hit ? " hit " : " missed ");
			thisAttackStringItem += "you with its " + thisAttack.weapon;
			attackStringArray.push(thisAttackStringItem);
		}
		reportString += txtPrs.makeReadable(txtPrs.listifyStringArray(attackStringArray)) + "!\n";
	}

	// moved
	if (input.moved.length > 0){
		var allMoveStrings = "";
		for (var i = 0; i < input.moved.length; i++){
			var thisMoveString = "You traveled ";
			if (input.moved[i].moveDir[0] == -1){
				thisMoveString += "north";
			} else if (input.moved[i].moveDir[0] == 1){
				thisMoveString += "south";
			}
			if (input.moved[i].moveDir[1] == -1){
				thisMoveString += "west";
			} else if (input.moved[i].moveDir[1] == 1){
				thisMoveString += "east";
			}
			allMoveStrings += txtPrs.makeReadable(thisMoveString) + "\n";
		}
		reportString += allMoveStrings;		
	}

	// neighbours
	if (input.neighbours.length > 0){
		// gotta figure this out. Don't currently have access to the party or actors from here.
		for (let nb of input.neighbours){
			reportString += "You see a " + nb.name + ".\n";
		}
	}

	// departures
	if (input.departures.length > 0){
		// use the same logic as above ^ 
	}

	// casualties
	if (input.casualties.length > 0){
		// ???? probably same as above?
	}

	// misc
	for (var i = 0; i < input.misc.length; i++){
		reportString += input.misc[i] + "\n";
	}

	return reportString;
}

function appendInfo(oldInfo, newInfo){
	for (var i = 0; i < newInfo.neighbours.length; i++){
		var toBeAdded = true;
		for (var j = 0; j < oldInfo.neighbours.length; j++){
			if (newInfo.neighbours[i].registry == oldInfo.neighbours[j].registry){
				toBeAdded = false;
			}
		}
		if (toBeAdded){
			var newEntry = {
				registry: newInfo.neighbours[i].registry,
				party: newInfo.neighbours[i].party
			}
			oldInfo.neighbours.push(newEntry);
		}
	}
	return oldInfo;
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
	distribFuncs,
	newInfoBlank,
	appendInfo
}