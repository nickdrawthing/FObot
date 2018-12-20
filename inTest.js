var actors = require("./actors.js");
var time = require("./timeScale.js");
var prompt = require("prompt");


function getActorInputs(){
	for (let ac of actrs){
		if (ac.controlledByPlayer){
			getUserInput(ac);
		} else {
			getAIInput(ac);
		}
	}
}

function getAIInput(ac){
	if (Math.random() < 0.5){
		ac.act = "ignores";
	} else {
		ac.act = "shoots at";
	}
}

function getUserInput(ac){
	prompt.start();
	prompt.get(['Choice'], function (err,result) {
		ac.act = result.Choice;
	});
}

function startInputTimer(){
	setTimeout(function(){
		prompt.pause();
		for (let ac of actrs){
			if (ac.act != null) {
				console.log(ac.name + " " + ac.act + " his enemy");
				ac.act = null;
			} else {
				console.log(ac.name + " does nothing");
			}
		}
		startInputCycle();
	},time.sec*10);
}

function startInputCycle(){
	getActorInputs();
	startInputTimer();
}

function loadSave(){
	actrs.push(new actors.Goodguy);
	actrs.push(new actors.Badguy);
}

function main(){
	prompt.start();
	loadSave();
	for (let ac of actrs){
		console.log(ac);
	}
	startInputCycle();
}

var actrs = [];
var txt = "";
main();




/*

Okay, so.
Let's talk about actors

*/