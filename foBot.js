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

var getInput = {
	getActorInputs: function(_actors){
		for (let thisActor of _actors){
			if (thisActor.controlledByPlayer){
				this.getUserInput(thisActor);
			} else {
				this.getAIInput(thisActor);
			}
		}
	},

	getAIInput: function(_actor){
		if (Math.random() < 0.5){
			_actor.act = "ignores";
		} else {
			_actor.act = "shoots at";
		}
	},

	getUserInput: function(_actor){
		prompt.start();
		prompt.get(['Choice'], function (err,result) {
			_actor.act = result.Choice;
		});
	}
}

function startInputTimer(_actors){
	setTimeout(function(){
		prompt.pause();
		for (let thisActor of _actors){
			if (thisActor.act != null) {
				console.log(thisActor.name + " " + thisActor.act + " his enemy");
				thisActor.act = null;
			} else {
				console.log(thisActor.name + " does nothing");
			}
			thisActor.hp++;
			thisActor.maxHP++;
			thisActor.inventory.rations++;
			thisActor.inventory.weapons.grenades++;
		}
		overwriteActors(_actors);
		fileManagement.saveFile(FOB);
		startInputCycle(FOB.actrs);
	},time.sec*4);
}

function startInputCycle(_actors){
	for (let ac of _actors){
		console.log(ac);
	}
	require('dns').resolve('www.twitter.com', function(err) {
	  	if (err) {
	    	console.log("No connection");
	    	setTimeout(startInputCycle,1000*5,_actors);
	  	} else {
		    console.log("Connected");
			getInput.getActorInputs(_actors);
			startInputTimer(_actors);
	  	}
	});
}
	
function overwriteActors(inPut){
	FOB.actrs = inPut;
}

function main(){
	prompt.start();
	FOB = fileManagement.loadFile(actors, startInputCycle);
}

var FOB = {
	actrs: [],
	map: null,
}

main();