var fs = require('fs');

module.exports = {
	showMap:  function(){
		var rawData = fs.readFile('./saveData.txt', function(err,data){
			if (err) {
				error = err;
				console.log(err);
			} else if (rawData != ""){
				var data = JSON.parse(data);
				var mapData = data.map;
				var mapImgTxt = "MAP\n";
				for (var i = 0; i < mapData.length; i++){
					for (var j = 0; j < mapData[i].length; j++){
						var pop = mapData[i][j].parties.length;
						var popImg = "";
						if (pop == 0){
							popImg = "  ";
						} else if (pop == 1){
							popImg = "░░"
						} else if (pop == 2){
							popImg = "▒▒";
						} else if (pop == 3){
							popImg = "▓▓";
						} else {
							popImg = "██";
						}
						for (var k = 0; k < pop; k++){
							if (mapData[i][j].parties[k] == 0){
								popImg = "XX";
							}
						}
						mapImgTxt = mapImgTxt+popImg;
					}
						mapImgTxt = mapImgTxt+"\n";
				}
				console.log(mapImgTxt);
			}
		});
	}
};

// module.exports.showMap();