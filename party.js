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
var utils = require("./utils.js");
var map = require("./map.js");

class Party{
	constructor(){
		this.registry;
		this.isPlayer = false;
		this.pool = {};
		this.members = [];
		this.dangerVal = 0;
		this.faction = 0;
		this.affinity = [];
		this.movement = []; // should contain an array of integers ranging from 0 to 5
	}
	determineMovement(mapp, partyNum){
		var moveTally = [0,0,0,0,0]; // [no movement, north, east, south, west]
		var sumMoves = 0;
		for (var mv of this.movement){
			moveTally[mv]++;
			sumMoves += mv;
		}
		this.movement = [];
		if (sumMoves > 0){
			var mostVotes = 0;
			var voteOpts = [];
			for (var i = 0; i < moveTally.length; i++){
				if (moveTally[i] > mostVotes){
					mostVotes = moveTally[i];
					voteOpts = [i];
				} else if (moveTally[i] == mostVotes) {
					voteOpts.push(i);
				}
			}
			voteOpts = utils.shuffleArr(voteOpts);
			if (voteOpts[0] != 0){
				if (voteOpts[0] == 1){
					mapp = map.moveParty(mapp, partyNum, -1, 0);
				} else if (voteOpts[0] == 2){
					mapp = map.moveParty(mapp, partyNum, 0, 1);
				} else if (voteOpts[0] == 3){
					 mapp = map.moveParty(mapp, partyNum, 1, 0);
				} else if (voteOpts[0] == 4){
					mapp = map.moveParty(mapp, partyNum, 0, -1);
				}
			}
		}
		return mapp;
	}
	updateRegistry(num, actrs){
		// update own registry
		this.registry = num;
		// update registry of party members
		var membs = this.members;
		for (var mem of membs){
			actrs[mem].party = num;
		}
		return actrs;
	}
}

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

module.exports = {
	createSplinterParty,
	createNewParty,
	createPlayerParty,
	disbandParty,
	distributeInventory,
	Party
}