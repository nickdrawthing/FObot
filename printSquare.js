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
				var comboImg = "";
				for (var i = 0; i < mapData.length; i++){
					var desImg = "";
					var urbImg = "";
					var varImg = "";
					var combo = "";
					for (var j = 0; j < mapData[i].length; j++){
						var des = mapData[i][j].destructVal;
						var urb = mapData[i][j].urbanVal;
						var vart = mapData[i][j].varietyVal;
						if (des <.05){
							desImg = desImg + "PP";
							combo = combo + "P";
						} else if (des >= .05 && des < .2){
							desImg = desImg + "░░";
							combo = combo + "░";
						} else if (des >= .2 && des < .5){
							desImg = desImg + "▒▒";
							combo = combo + "▒";
						} else if (des >= .5 && des < .7){
							desImg = desImg + "▓▓";
							combo = combo + "▓";
						} else {
							desImg = desImg + "XX";
							combo = combo + "X";
						}

						if (urb <.3){
							urbImg = urbImg + "WW";
							combo = combo + "W";
						} else if (urb >= .3 && urb < .4){
							urbImg = urbImg + "░░";
							combo = combo + "░";
						} else if (urb >= .4 && urb < .6){
							urbImg = urbImg + "▒▒";
							combo = combo + "▒";
						} else if (urb >= .6 && urb < .8){
							urbImg = urbImg + "▓▓";
							combo = combo + "▓";
						} else {
							urbImg = urbImg + "!!";
							combo = combo + "!";
						} // █
						if (vart <.2){
							varImg = varImg + "  ";
							combo = combo + " ";
						} else if (vart >= .2 && vart < .4){
							varImg = varImg + "..";
							combo = combo + ".";
						} else if (vart >= .4 && vart < .6){
							varImg = varImg + ",,";
							combo = combo + ",";
						} else if (vart >= .6 && vart < .8){
							varImg = varImg + "::";
							combo = combo + ":";
						} else {
							varImg = varImg + "##";
							combo = combo + "#";
						}
					}
					mapImgTxt = mapImgTxt + desImg + "" + urbImg + "" + varImg + "\n";
					comboImg = comboImg + combo + "\n" + combo + "\n";
				}
				console.log(mapImgTxt);
			}
			console.log(comboImg);
		});
	}
};

module.exports.showMap();