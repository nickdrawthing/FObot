var fs = require('fs');

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
					actorsList.push(new actors.Goodguy);
					actorsList.push(new actors.Badguy);
					retVal.actrs = actorsList;

					retVal.mapSize = 3;
					var map = [];
					for (let x = 0; x < retVal.mapSize; x++){
						var mapRow = [];
						for (let y = 0; y < retVal.mapSize; y++){
							mapRow.push({parties: [], name: "Flat Ground"});
						}
						map.push(mapRow);
					}
					retVal.map = map;
				} else {
					retVal = JSON.parse(data);
					console.log(retVal);
				}
				callback(retVal.actrs);
			}
		});
		console.log("=====RETURN VALUE=====\n" + retVal + "\n======RETURN END=====");
		return retVal;
	},
	saveFile: function(JSONdata){
		var data = JSON.stringify(JSONdata);
		fs.writeFile('saveData.txt', data, function(err,data){
			if (err) console.log(err);
			console.log("saved successfully");
		});
	}
}