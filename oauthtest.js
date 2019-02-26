var Twit = require('./node_modules/twit');
var Auth = require('../keys.js');
// var Auth = require('./foBotAuth.js');
var T = new Twit(Auth);

var reqOpts = {
	headers: {
		'callback': 'oob',
	    'Accept': '*/*',
	    'User-Agent': 'Twitter-iPhone/6.45 iOS/9.0.2 (Apple;iPhone8,2;;;;;1)',
	    'X-Twitter-Client': 'Twitter-iPhone',
	    'X-Twitter-API-Version': '5',
	    'X-Twitter-Client-Language': 'en',
	    'X-Twitter-Client-Version': '6.45'
	},
	gzip: true,
	encoding: null,
}

T.post('oauth/request_token',reqOpts,function(err,data,response){
	console.log(err);
	console.log(data);
	console.log(response);
});