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
	getActorInputs: function(_FOB){

		// TODO:
		// Make this check the PARTY array for each map tile rather than 
		// check the actors list directly. This way it will be easier to 
		// apply uniform situational effects based on grid squares, apply 
		// party movements, etc.

		for (let thisActor of _FOB.actrs){
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

function startInputTimer(_FOB){
	setTimeout(function(){
		prompt.pause();
		for (let thisActor of _FOB.actrs){
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
		overwriteActors(_FOB.actrs);
		fileManagement.saveFile(FOB);
		startInputCycle(FOB);
	},time.sec*4);
}

function startInputCycle(_FOB){
	for (let ac of _FOB.actrs){
		console.log(ac);
	}
	require('dns').resolve('www.twitter.com', function(err) {
	  	if (err) {
	    	console.log("No connection");
	    	setTimeout(startInputCycle,1000*5,_FOB);
	  	} else {
		    console.log("Connected");
			getInput.getActorInputs(_FOB);
			startInputTimer(_FOB);
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