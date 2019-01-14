var fs = require('fs');
var SimplexNoise = require('simplex-noise');
var party = require("./party.js");

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

					var noiseScale = 1;
					retVal.mapSize = 3;

					var map = [];
					var destructSeed = new SimplexNoise(Math.random + 'destruct');
					var lowestDestruct = 2;
					var highestDestruct  = -2;
					var urbanSeed = new SimplexNoise(Math.random + 'urban');
					var lowestUrban = 2;
					var highestUrban  = -2;
					
					for (let x = 0; x < retVal.mapSize; x++){
						var mapRow = [];
						for (let y = 0; y < retVal.mapSize; y++){
							//VVVVV THIS IS TEMP AND NEEDS TO BE MORE ROBUST VVVVV
							var partyObj;
							if (y == 0 && x == 0){
								partyObj = party.createPlayerParty(0);
							} else {
								partyObj = party.createNewParty();
							}
							console.log(partyObj);
							var actorListLength = actorsList.length;
							for (var i = 0; i < partyObj.actors.length; i++){
								actorsList.push(partyObj.actors[i]);
								partyObj.party.members.push(actorListLength + i);
							}
							// actorsList.push(partyObj.actors);
							// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
							var mapCell = {
								parties: [partyObj.party],
								destructVal:destructSeed.noise2D((1+x)/noiseScale,(1+y)/noiseScale),
								urbanVal:urbanSeed.noise2D((1+x)/noiseScale,(1+y)/noiseScale)
							};
							if (mapCell.destructVal < lowestDestruct){
								lowestDestruct = mapCell.destructVal;
							}
							if (mapCell.destructVal > highestDestruct){
								highestDestruct = mapCell.destructVal;
							}
							if (mapCell.urbanVal < lowestUrban){
								lowestUrban = mapCell.urbanVal;
							}
							if (mapCell.urbanVal > highestUrban){
								highestUrban = mapCell.urbanVal;
							}
							// console.log(mapCell);
							mapRow.push(mapCell);
						}
						map.push(mapRow);
					}
					for (let x = 0; x < retVal.mapSize; x++){
						for (let y = 0; y < retVal.mapSize; y++){
							map[x][y].destructVal = scaleNormalize(map[x][y].destructVal,lowestDestruct,highestDestruct);
							map[x][y].urbanVal = scaleNormalize(map[x][y].urbanVal,lowestUrban,highestUrban);
						}
					}
					retVal.map = map;
					retVal.actrs = actorsList;
				} else {
					retVal = JSON.parse(data);
				}
				callback(retVal);
			}
		});
	return retVal;

	function scaleNormalize(val, low, high){
		return (val-low) / (high-low);
	}
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