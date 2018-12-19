var prompt = require("prompt");
prompt.start();


function getUserInput(num){
	prompt.start();
	prompt.get(['Choice'], function (err,result) {
		txt = result.Choice;
	});
	console.log(num);
	setTimeout(function(){
		prompt.pause();
		console.log(txt);
		if (txt != "x"){
			getUserInput(num+1);
		}
	},5000);
}

function main(){
	getUserInput(0);
}

var txt = "";
main();