module.exports = {
	shuffleArr: function(a) {
	    var j, x, i;
	    for (i = a.length - 1; i > 0; i--) {
	        j = Math.floor(Math.random() * (i + 1));
	        x = a[i];
	        a[i] = a[j];
	        a[j] = x;
	    }
	    return a;
	},

	testStat: function(input){
		var retVal = false;
		if (Math.random() < input){
			retVal = true;
		}
		return retVal;
	},

	testVs: function(inputA, inputB){
		var retVal = false;
		if (inputA > 0){
			var aTest = false;
			var bTest = false;
			while ((!aTest && !bTest) || (aTest && bTest)){
				aTest = this.testStat(inputA);
				bTest = this.testStat(inputB);
			}
			if (aTest && !bTest){
				retVal = true;
			}
		}
		return retVal;
	},

	knownNeighbour: function(known, reg){
		var retVal = false;
		for (var nbr = 0; nbr < known.neighbours.length; nbr++){
			if (known.neighbours[nbr].registry == reg) {
				retVal = true;
			}
		}
		return retVal;
	},

	parseDirection: function(input){
		var retVal = "";
		if (input[0] == -1){
			retVal += "north";
		} else if (input[0] == 1){
			retVal += "south";
		}
		if (input[1] == -1){
			retVal += "west";
		} else if (input[1] == 1){
			retVal += "east";
		}
		retVal = retVal.charAt(0).toUpperCase() + retVal.slice(1);	
		return retVal;
	}
}