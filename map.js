function moveParty(map,partyNum,x,y){
	// console.log("doing map thing. party num: " + partyNum);
	for(var i = 0; i < map.length; i++){
		for(var j = 0; j < map[i].length; j++){
			for (var k = 0; k < map[i][j].parties.length; k++){
				// console.log("PartyNum: " + partyNum + ", Map Cell Party: " + map[i][j].parties[k]);
				if (map[i][j].parties[k] == partyNum){
					if (testMapMove(map,i,j,x,y)){
						console.log("You go the way you wanted)");
						map[i][j].parties.splice(k,1);
						map[i+x][j+y].parties.push(partyNum);
						return map;
					} else {
						console.log("You can't go that way");
					}
				}
			}
		}	
	}
	return map;

	function testMapMove(map,x,y,moveX,moveY){
		var retVal;
		console.log("x: " + (x+moveX) + ", y: " + (y+moveY));
		if (((x + moveX) < 0) || ((x + moveX) >= map.length) || ((y + moveY) < 0) || ((y + moveY >= map[x].length))){
			retVal = false;
			console.log("false");
		} else {
			retVal = true;
			console.log("true");
		}

		return retVal;
	}
}

module.exports = {
	moveParty
}