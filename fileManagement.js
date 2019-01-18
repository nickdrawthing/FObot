var fs = require('fs');
var party = require("./party.js");
var map = require("./map.js");

function loadFile(actors, callback){
	var retVal = {};
		var error;
		var data = fs.readFile('./saveData.txt', function(err,data){
			if (err) {
				error = err;
				console.log(err);
			} else {
				if (data == ""){
					console.log("TIS BLANK, MDUDE");
					var actorsList = [];
					var partyList = [];
					retVal.mapSize = 50;
					var thisMap = map.makeNewMap(retVal.mapSize);
				
					for (let x = 0; x < thisMap.length; x++){
						for (let y = 0; y < thisMap[x].length; y++){
							//VVVVV THIS IS TEMP AND NEEDS TO BE MORE ROBUST VVVVV
							var partyObj;
							if (y == 0 && x == 0){
								partyObj = party.createPlayerParty(0);
							} else {
								partyObj = party.createNewParty();
							}
							var actorListLength = actorsList.length;
							for (var i = 0; i < partyObj.actors.length; i++){
								actorsList.push(partyObj.actors[i]);
								partyObj.party.members.push(actorListLength + i);
							}
							// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
							partyList.push(partyObj.party);
							var partyListLength = partyList.length;
							thisMap[x][y].parties.push(partyListLength-1);
						}
					}
					retVal.map = thisMap;
					retVal.actrs = actorsList;
					retVal.parties = partyList;
				} else {
					retVal = JSON.parse(data);
				}
				callback(retVal);
			}
		});
	return retVal;
}

function saveFile(JSONdata){
	var data = JSON.stringify(JSONdata);
	fs.writeFile('saveData.txt', data, function(err,data){
		if (err) console.log(err);
		console.log("saved successfully");
	});
}

module.exports = {
	loadFile,
	saveFile
}