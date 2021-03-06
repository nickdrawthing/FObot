// var SimplexNoise = require('simplex-noise');
var noiseJS = require("noisejs");

function moveParty(FOB,partyNum,x,y){
	var i = FOB.parties[partyNum].mapLoc[0];
	var j = FOB.parties[partyNum].mapLoc[1];
	// //loop through map, then loop through the parties in each cell
	// for(var i = 0; i < FOB.map.length; i++){
	// 	for(var j = 0; j < FOB.map[i].length; j++){
	for (var k = 0; k < FOB.map[i][j].parties.length; k++){
		// check if party is the one we're looking for
		if (FOB.map[i][j].parties[k] == partyNum){
			if (testMapMove(FOB.map,i,j,x,y)){
				// console.log("You go the way you wanted");
				FOB.map[i][j].parties.splice(k,1);
				FOB.map[i+x][j+y].parties.push(partyNum);
				FOB.map[i+x][j+y].parties[FOB.map[i+x][j+y].parties.length-1].mapLoc = [i+x,j+y];
				// update the party and actor map location values 
				FOB.parties[partyNum].mapLoc = [i+x,j+y];
				for (var l = 0; l < FOB.parties[partyNum].members.length; l++){
					FOB.actrs[FOB.parties[partyNum].members[l]].mapLoc = [i+x,j+y];
					FOB.actrs[FOB.parties[partyNum].members[l]].newInfo.moved.push({moveDir: [x,y]});
					FOB.actrs[FOB.parties[partyNum].members[l]].knownInfo.neighbours = [];
				}
				// loop through remaining parties in previous cell to remove self from their known list
				// loop through parties
				for (var m = 0; m < FOB.map[i][j].parties.length; m++){
					var thisPartyNum = FOB.map[i][j].parties[m];
					// loop through members of each party
					for (var n = 0; n < FOB.parties[thisPartyNum].members.length; n++){
						var actorNum = FOB.parties[thisPartyNum].members[n];
						//loop through known info list
						var thisPartySeen = false;
						for (var o = 0; o < FOB.actrs[actorNum].knownInfo.neighbours.length; o++){
							// remove all members with partyNum      // {"registry":8,"party":3}
							if (FOB.actrs[actorNum].knownInfo.neighbours[o].party == partyNum){
								thisPartySeen = true;
								FOB.actrs[actorNum].knownInfo.neighbours.splice(o,1);
							}
						}
						if (thisPartySeen){
							for (var p = 0; p < FOB.parties[partyNum].members.length; p++){
								//{name: string, moveDir: [x,y], priority: 1}
								FOB.actrs[actorNum].newInfo.departures.push(
									{
										name: FOB.actrs[FOB.parties[partyNum].members[p]].name,
										moveDir: [x,y]
									}
								);
							}
						}
					}
				}
				return FOB;
			} else {
				// console.log("You can't go that way");

			}
		}
	}
	// 	}	
	// }
	return FOB;

	function testMapMove(map,x,y,moveX,moveY){
		var retVal;
		// console.log("x: " + (x+moveX) + ", y: " + (y+moveY));
		if (((x + moveX) < 0) || ((x + moveX) >= map.length) || ((y + moveY) < 0) || ((y + moveY >= map[x].length))){
			retVal = false;
		} else {
			retVal = true;
		}
		return retVal;
	}
};

function makeNewMap(arraySize){

	var retVal = [];

	var noiseScale = .07;
	// var destructSeed = new SimplexNoise(Math.random + 'destruct');
	var destructSeed = new noiseJS.Noise(Math.random());
	var lowestDestruct = 2;
	var highestDestruct  = -2;
	// var urbanSeed = new SimplexNoise(Math.random + 'urban');
	var urbanSeed = new noiseJS.Noise(Math.random());
	var lowestUrban = 2;
	var highestUrban  = -2;

	var varietySeed = new noiseJS.Noise(Math.random());
	var lowestVariety = 2;
	var highestVariety = -2;
	
	for (let x = 0; x < arraySize; x++){
		var mapRow = [];
		for (let y = 0; y < arraySize; y++){
			var mapCell = {
				cover: null,
				description: "",
				lairs: null,
				parties: [],
				loot: [],
				// destructVal:destructSeed.noise2D((1+x)/noiseScale,(1+y)/noiseScale),
				// urbanVal:urbanSeed.noise2D((1+x)/noiseScale,(1+y)/noiseScale)
				destructVal: destructSeed.simplex2(x*noiseScale,y*noiseScale),
				urbanVal: urbanSeed.perlin2(x*noiseScale,y*noiseScale),
				varietyVal: varietySeed.simplex2(x*(noiseScale*4),y*(noiseScale)*4),
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
			if (mapCell.varietyVal < lowestVariety){
				lowestVariety = mapCell.varietyVal;
			}
			if (mapCell.varietyVal > highestVariety){
				highestVariety = mapCell.varietyVal;
			}
			// console.log(mapCell);
			mapRow.push(mapCell);
		}
		retVal.push(mapRow);
	}
	for (let x = 0; x < arraySize; x++){
		for (let y = 0; y < arraySize; y++){
			retVal[x][y].destructVal = scaleNormalize(retVal[x][y].destructVal,lowestDestruct,highestDestruct);
			retVal[x][y].urbanVal = scaleNormalize(retVal[x][y].urbanVal,lowestUrban,highestUrban);
			retVal[x][y].varietyVal = scaleNormalize(retVal[x][y].varietyVal,lowestVariety,highestVariety);
		}
	}
	console.log(retVal);
	return retVal;

	function scaleNormalize(val, low, high){
		return (val-low) / (high-low);
	}

}

module.exports = {
	makeNewMap,
	moveParty
}