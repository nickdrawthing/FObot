var fs = require('fs');
var party = require("./party.js");
var map = require("./map.js");
var printMap = require("./printMap.js");

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
					retVal.mapSize = 35;
					var thisMap = map.makeNewMap(retVal.mapSize);
					var madeplayer = false;
					for (let x = 0; x < thisMap.length; x++){
						for (let y = 0; y < thisMap[x].length; y++){
							//VVVVV THIS IS TEMP AND NEEDS TO BE MORE ROBUST VVVVV
							if (Math.random()>0.95){
								var partyObj;
								if (!madeplayer){
									partyObj = party.createPlayerParty(0);
									madeplayer = true;
								} else {
									partyObj = party.createNewParty();
								}
								var actorListLength = actorsList.length;
								for (var i = 0; i < partyObj.actors.length; i++){
									actorsList.push(partyObj.actors[i]);
									partyObj.party.members.push(actorListLength + i);
									actorsList[actorsList.length-1].updateRegistry(actorsList.length-1);
									actorsList[actorsList.length-1].mapLoc = [x,y];
								}
								// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
								partyList.push(partyObj.party);
								partyList[partyList.length-1].mapLoc = [x,y];
								var partyListLength = partyList.length;
								thisMap[x][y].parties.push(partyListLength-1);
								actorsList = partyList[partyList.length-1].updateRegistry(partyList.length-1,actorsList);
							}
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
		printMap.showMap();
	});
}

module.exports = {
	loadFile,
	saveFile
}