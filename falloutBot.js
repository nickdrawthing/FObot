var prompt = require("prompt");

prompt.start();

// //
// // Get two properties from the user: username and email
// //
// prompt.get(['username', 'email'], function (err, result) {
// //
// // Log the results.
// //
// console.log('Command-line input received:');
// console.log('  username: ' + result.username);
// console.log('  email: ' + result.email);
// });

// function offerChoices(choices, callback){
// 	console.log("Options: ");
// 	for (var i = 0; i < choices.length; i++){
// 		console.log (i + " " + choices[i].text);
// 	}
// 	prompt.get(['Choice'], function (err,result) {
// 		var selection = result.Choice;
// 		if (choices[selection] != undefined){
// 			choices[selection].followupPrompt();
// 			if (choices[selection].followups != null){
// 				offerChoices(choices[selection].followups, callback);
// 			} else {
// 				callback();
// 				offerChoices(questions, )
// 			}
// 		}
// 	})
// }

// var questions = [
// 	{
// 		text: 'attack',
// 		followupPrompt: function(){console.log("Who to attack?")},
// 		followups: [
// 			{
// 				text: 'a robot',
// 				followupPrompt: function(){console.log("You attacked " + this.text)},
// 				followups: null
// 			},
// 			{
// 				text: 'a zombie',
// 				followupPrompt: function(){console.log("You attacked " + this.text)},
// 				followups: null
// 			}
// 		]
// 	},
// 	{
// 		text: 'flee',
// 		followupPrompt: function(){
// 			if (Math.random()>0.5){
// 				console.log("you got away");
// 			} else {
// 				console.log("you got shot in the back as you fled.");
// 			}
// 		},
// 		followups:null
// 	}
// ]

// offerChoices(questions, function(){console.log("DONE")});

var monsters = [
	{
		hp: 2,
		name: "zombie"
	},{
		hp: 3,
		name: "robot"
	}
];

createPlayerOptions();	


//Determine Case and Assemble Appropriate Options Stack
function createPlayerOptions(){
	//compile list of living monsters
	var liveMonsterList = [];
	for (var i = 0; i < monsters.length; i++){
		if (monsters[i].hp > 0){
			liveMonsterList.push(i);
		}
	}
	if (liveMonsterList.length > 1){
		// make main choice container
		var choiceObj = [];
		// make attack options
		var choiceAttack = {
			text: "attack",
			action: function(){console.log("Which target?");}
		};
		var attackTargets = [];
		for (var i = 0; i < liveMonsterList.length; i++){
			var currentIndex = i;
			attackTargets.push({
				targetIndexVal: liveMonsterList[currentIndex],
				text: monsters[liveMonsterList[currentIndex]].name + ", (" + monsters[liveMonsterList[currentIndex]].hp + " hp)",
				action: function(){
					console.log(liveMonsterList[currentIndex]);
					monsters[liveMonsterList[currentIndex]].hp--;
					console.log("You attacked " + this.text);
				},
				followups: null
			});
		}
		choiceAttack.followups = attackTargets;
		choiceObj.push(choiceAttack);
		getUserInput(choiceObj);
	}else{
		console.log("All hostiles are toast!");
		console.log("Game over");
	}
}

//Collect User Input
function getUserInput(choices){
	//post tweet with options
	//wait for reply
	//if reply has sub-options, repeat process with new options
	//collect final node reply and callback applyUesrInput();
	// console.log(choices);
	console.log("Options: ");
	for (var i = 0; i < choices.length; i++){
		console.log (i + " " + choices[i].text);
	}
	prompt.get(['Choice'], function (err,result) {
		var selection = result.Choice;
		if (choices[selection] != undefined){
			choices[selection].action();
			if (choices[selection].followups != null){
				getUserInput(choices[selection].followups);
			} else {
				applyUserInput(choices[selection].action);
			}
		}
	})
}


//Apply User Input
function applyUserInput(action){
	action();
	applyEnvironment();
}

//Apply Environmental Effects
function applyEnvironment(){
	//do any environmental stuff
	console.log("gunfire rings out in the distance.");
	npcAction();
}

//For all actors{
//	Act based on new situation
//}
function npcAction(){
	tweetUpdates();
}

//Display pertinent new info
function tweetUpdates(){
	createPlayerOptions();
}


