var fs = require('fs');
var SimplexNoise = require('simplex-noise');

module.exports = {
	loadFile: function(actors, callback){
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

					// TODO
					// Create PARTIES, not individual ACTORS. Those parties will be
					// stored in the map array.

					actorsList.push(new actors.Goodguy);
					actorsList.push(new actors.Badguy);
					

					retVal.actrs = actorsList;

					var noiseScale = 8;
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
							var mapCell = {
								parties: [],
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
							mapRow.push(mapCell);
						}
						map.push(mapRow);
					}
					console.log("Destruct - High: " + lowestDestruct + " Low: " + highestDestruct);
					console.log("Urban - High: " + lowestUrban + " Low: " + highestUrban);
					for (let x = 0; x < retVal.mapSize; x++){
						for (let y = 0; y < retVal.mapSize; y++){
							map[x][y].destructVal = scaleNormalize(map[x][y].destructVal,lowestDestruct,highestDestruct);
							map[x][y].urbanVal = scaleNormalize(map[x][y].urbanVal,lowestUrban,highestUrban);
						}
					}
					retVal.map = map;
				} else {
					retVal = JSON.parse(data);
					console.log(retVal);
				}
				callback(retVal);
			}
		});
		console.log("=====RETURN VALUE=====\n" + retVal + "\n======RETURN END=====");
		return retVal;

		function scaleNormalize(val, low, high){
			return (val-low) / (high-low);
		}
	},
	saveFile: function(JSONdata){
		var data = JSON.stringify(JSONdata);
		fs.writeFile('saveData.txt', data, function(err,data){
			if (err) console.log(err);
			console.log("saved successfully");
		});
	}
}