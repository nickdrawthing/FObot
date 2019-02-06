var Twit = require('./node_modules/twit');
var Auth = require('../keys.js');
// var Auth = require('./foBotAuth.js');
var T = new Twit(Auth);
var actors = require("./actors.js");
var time = require("./timeScale.js");
var fileManagement = require("./fileManagement.js");
var prompt = require("prompt");
var armour = require("./armour.js");
var weapon = require("./weapons.js");
var party = require("./party.js");
var map = require("./map.js");

var mapFuncs = {
	partyMove: function(_FOB,address,dir){

	}
}

var getInput = {
	getActorInputs: function(_FOB){
		_FOB.map.forEach(function(mapRow){
			mapRow.forEach(function(mapCell){
				// Map Cell v
				mapCell.parties.forEach(function(thisParty){
					// thisParty is an array address for _FOB.party
					_FOB.parties[thisParty].members.forEach(function(thisActor){
						// thisActor is an array address for _FOB.actrs
						// console.log(_FOB.actrs[thisActor]);

						if (_FOB.actrs[thisActor].controlledByPlayer){
							// console.log("FOUND THE PLAYER");
							getInput.getUserInput(_FOB.actrs[thisActor]);
						} else {
							getInput.getAIInput(_FOB.actrs[thisActor]);
						}

					});
				});
			});
		});
	},

	getAIInput: function(_actor){
		var randChoice = Math.random();
		if (randChoice < 0.2){
			_actor.act = "w";
		} else if (randChoice >= 0.2 && randChoice < 0.4){
			_actor.act = "a";
		} else if (randChoice >= 0.4 && randChoice < 0.6){
			_actor.act = "s";
		} else if (randChoice >= 0.6 && randChoice < 0.8){
			_actor.act = "d";
		} else if (randChoice >= 0.8){
			_actor.act = null;
		}
	},

	getUserInput: function(_actor){
		prompt.start();
		prompt.get(['Choice'], function (err,result) {
			_actor.act = result.Choice;
		});
	}
}

function startInputTimer(_FOB){
	setTimeout(parseActorInput,time.sec*4,_FOB,startInputCycle);
}

function parseActorInput(_FOB, callback){
	prompt.pause();
	// for (let thisActor of _FOB.actrs){
	for (var i = 0; i < _FOB.actrs.length; i++){
		var thisActor = _FOB.actrs[i];
		if (thisActor.act != null) {
			if (thisActor.act == "W" || thisActor.act == "w"){
				_FOB.parties[thisActor.party].movement.push(1);
				// _FOB.map = map.moveParty(_FOB.map,i,-1,0);
				// console.log("You go North");
			} else if (thisActor.act == "S" || thisActor.act == "s"){
				_FOB.parties[thisActor.party].movement.push(3);
				// _FOB.map = map.moveParty(_FOB.map,i,1,0);
				// console.log("You go South");
			} else if (thisActor.act == "D" || thisActor.act == "d"){
				_FOB.parties[thisActor.party].movement.push(2);
				// _FOB.map = map.moveParty(_FOB.map,i,0,1);
				// console.log("You go East");
			} else if (thisActor.act == "A" || thisActor.act == "a"){
				_FOB.parties[thisActor.party].movement.push(4);
				// _FOB.map = map.moveParty(_FOB.map,i,0,-1);
				// console.log("You go West");
			} else {
				_FOB.parties[thisActor.party].movement.push(0);
				// console.log(thisActor.name + " " + thisActor.act + " his enemy");
				// thisActor.act = null;
			}
		} else {
			// console.log(thisActor.name + " does nothing");
		}
		thisActor.act = null;
		thisActor.hp++;
		thisActor.maxHP++;
		thisActor.inventory.rations++;
		thisActor.inventory.weapons.grenades++;
	}

	// check parties for movement
	for (var i = 0; i < _FOB.parties.length; i++){
		_FOB.map = party.determineMovement(_FOB.map, i, _FOB.parties[i]);
	}

	// overwriteActors(_FOB.actrs,fileManagement.saveFile);
	overwriteFOB(_FOB,fileManagement.saveFile)
	// fileManagement.saveFile(FOB);
	callback(FOB);
}

function startInputCycle(_FOB){
	// console.log(_FOB);
	for (let ac of _FOB.actrs){
		// console.log(ac);
	}
	require('dns').resolve('www.twitter.com', function(err) {
	  	if (err) {
	    	console.log("No connection");
	    	setTimeout(startInputCycle,1000*2.5,_FOB);
	  	} else {
		    console.log("Connected");
			getInput.getActorInputs(_FOB);
			startInputTimer(_FOB);
	  	}
	});
}
	
function overwriteActors(inPut, callback){
	FOB.actrs = inPut;
	callback(FOB);
}

function overwriteMap(inPut, callback){
	FOB.map = inPut;
	callback(FOB);
}

function overwriteFOB(inPut, callback){
	FOB = inPut;
	callback(FOB);
}

function main(){
	prompt.start();
	FOB = fileManagement.loadFile(actors, startInputCycle);
}

var FOB = {
	// actrs: [],
	// map: null,
}

main();