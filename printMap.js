var fs = require('fs');

var rawData = fs.readFile('./saveData.txt', function(err,data){
	if (err) {
		error = err;
		console.log(err);
	} else {
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
				mapImgTxt = mapImgTxt+popImg;
			}
				mapImgTxt = mapImgTxt+"\n";
		}
		console.log(mapImgTxt);
	}
});