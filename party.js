var actors = require("./actors.js");

function createSplinterParty(members){
	var retObj = {};
	retObj.party = new Party;
	retObj.party.members = members;
	retObj.party.dangerVal = calculateDangerVal(retObj.actors);
	return retObj;
}

function createNewParty(isPlayer){
	var retObj = {};
	retObj.party = new Party;
	if (isPlayer){
		retObj.actors = [new actors.Goodguy];
	} else {
		retObj.actors = [new actors.Badguy];
	}
	retObj.party.dangerVal = calculateDangerVal(retObj.actors);
	return retObj;
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
	distributeInventory,
	Party
}