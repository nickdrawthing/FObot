/*

Party_n {
	name: ,
	members: [43,45,56],
	dangerVal: .3534567,
	faction: 4,
	affinity: [true, true, false, true, false],
	pool: {}
}

*/


var actors = require("./actors.js");

function createSplinterParty(members){
	var retObj = {};
	retObj.party = new Party;
	retObj.party.members = members;
	retObj.party.dangerVal = calculateDangerVal(retObj.actors);
	return retObj;
}

function createNewParty(){
	// create actors
	var acts = [];
	for (var i = 0; i < 3; i++){
		acts.push(new actors.Badguy);
	}

	// create party
	var party = new Party;
	party.dangerVal = calculateDangerVal(acts);

	// create return object which contains actors and party
	var retObj = {};
	retObj.party = party;
	retObj.actors = acts;
	// console.log("party made: " + retObj);
	return retObj;
}

function createPlayerParty(actorVal){
	// create player
	var acts = [];
	acts.push(new actors.Goodguy);
	acts[0].actorVal = actorVal;

	// create party
	var party = new Party;
	party.isPlayer = true;
	party.dangerVal = calculateDangerVal(acts);

	// create return object which contains actors and party
	var retObj = {};
	retObj.party = party;
	retObj.actors = acts;
	// console.log("p1 party made: " + retObj);

	return retObj;
}

function disbandParty(){

}

function distributeInventory(party, members){
	//Each party member inspects each inventory item in the pool
	//and swaps it if it is an improvement.
	//Potentially reverse the party array order after?
	party.dangerVal = calculateDangerVal(party);
	return party;
}

function calculateDangerVal(members){
	return 0;
}

class Party{
	constructor(){
		this.isPlayer = false;
		this.pool = {};
		this.members = [];
		this.dangerVal = 0;
		this.faction = 0;
		this.affinity = [];
	}
}

module.exports = {
	createSplinterParty,
	createNewParty,
	createPlayerParty,
	disbandParty,
	distributeInventory,
	Party
}