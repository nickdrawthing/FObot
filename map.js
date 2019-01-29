// var SimplexNoise = require('simplex-noise');
var noiseJS = require("noisejs");

function moveParty(map,partyNum,x,y){
	// console.log("doing map thing. party num: " + partyNum);
	for(var i = 0; i < map.length; i++){
		for(var j = 0; j < map[i].length; j++){
			for (var k = 0; k < map[i][j].parties.length; k++){
				// console.log("PartyNum: " + partyNum + ", Map Cell Party: " + map[i][j].parties[k]);
				if (map[i][j].parties[k] == partyNum){
					if (testMapMove(map,i,j,x,y)){
						// console.log("You go the way you wanted");
						map[i][j].parties.splice(k,1);
						map[i+x][j+y].parties.push(partyNum);
						return map;
					} else {
						// console.log("You can't go that way");
					}
				}
			}
		}	
	}
	return map;

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