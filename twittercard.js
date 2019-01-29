var T = require("twit");
var Q = require("q");

// key and secret for Twitter for iPhone.
//  A whitelisted app is needed to access the cards API; you can't just create your own currently.
var TWITTER_CONSUMER_KEY     = "IQKbtAYlXLripLGPWd0HUA";
var TWITTER_CONSUMER_SECRET  = "GgDYlkSvaPxGxC4X8liwpUoqKwwr3lCADbz8A7ADU";
// These you will have to fill in yourself by authorizing Twitter for iPhone for your account.
//  How to get the access tokens through OOB authorization is outside the scope of this snippet.
var TWITTER_ACCESS_TOKEN    = "";
var TWITTER_ACCESS_SECRET    = "";

var oauth = new T({
	      consumer_key:    TWITTER_CONSUMER_KEY,    
	      consumer_secret: TWITTER_CONSUMER_SECRET, 
	      access_token:    TWITTER_ACCESS_TOKEN,   
	      access_token_secret:   TWITTER_ACCESS_SECRET
});

/*
To make the card posting work correctly, we need to do some editing to how the request is built.
We need special headers and a special endpoint.
So after creating the Twit instance, we just wholesale replace the method for it.
*/
oauth._buildReqOpts = function (method, path, params, isStreaming, callback) {
	var helpers = require("twit/lib/helpers");
	var endpoints = require("twit/lib/endpoints");
	var FORMDATA_PATHS = [];
  var self = this
  if (!params) {
      params = {}
  }
  // clone `params` object so we can modify it without modifying the user's reference
  var paramsClone = JSON.parse(JSON.stringify(params))
  // convert any arrays in `paramsClone` to comma-seperated strings
  var finalParams = this.normalizeParams(paramsClone)
  delete finalParams.twit_options

  // the options object passed to `request` used to perform the HTTP request
  var reqOpts = {
    headers: {
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

  if (typeof self.config.timeout_ms !== 'undefined') {
      reqOpts.timeout = self.config.timeout_ms;
  }

  try {
      // finalize the `path` value by building it using user-supplied params
      path = helpers.moveParamsIntoPath(finalParams, path)
  } catch (e) {
      callback(e, null, null)
    return
  }

  if (isStreaming) {
      // This is a Streaming API request.

    var stream_endpoint_map = {
	    user: endpoints.USER_STREAM,
	    site: endpoints.SITE_STREAM
    }
    var endpoint = stream_endpoint_map[path] || endpoints.PUB_STREAM
    reqOpts.url = endpoint + path + '.json'
  } else {
      // This is a REST API request.

    if (path === 'media/upload') {
	    // For media/upload, use a different entpoint and formencode.
	    reqOpts.url = endpoints.MEDIA_UPLOAD + 'media/upload.json';
    } else if(path.indexOf("cards/") === 0) {
	    reqOpts.url = 'https://caps.twitter.com/v2/' + path + '.json';
    } else {
	    reqOpts.url = endpoints.REST_ROOT + path + '.json';
    }

    if (FORMDATA_PATHS.indexOf(path) !== -1) {
	    reqOpts.headers['Content-type'] = 'multipart/form-data';
	    reqOpts.form = finalParams;
	    // set finalParams to empty object so we don't append a query string
	    // of the params
	    finalParams = {};
    } else {
	    reqOpts.headers['Content-type'] = 'application/json';
    }
  }

  if (Object.keys(finalParams).length) {
    // not all of the user's parameters were used to build the request path
    // add them as a query string
    var qs = helpers.makeQueryString(finalParams)
    reqOpts.url += '?' + qs
  }

  if (!self.config.app_only_auth) {
    // with user auth, we can just pass an oauth object to requests
    // to have the request signed
    var oauth_ts = Date.now() + self._twitter_time_minus_local_time_ms;

    reqOpts.oauth = {
	    consumer_key: self.config.consumer_key,
	    consumer_secret: self.config.consumer_secret,
	    token: self.config.access_token,
	    token_secret: self.config.access_token_secret,
	    timestamp: Math.floor(oauth_ts/1000).toString(),
    }

    callback(null, reqOpts);
    return;
  } else {
      // we're using app-only auth, so we need to ensure we have a bearer token
      // Once we have a bearer token, add the Authorization header and return the fully qualified `reqOpts`.
      self._getBearerToken(function (err, bearerToken) {
	    if (err) {
		    callback(err, null);
        return;
	    }

	    reqOpts.headers['Authorization'] = 'Bearer ' + bearerToken;
	    callback(null, reqOpts);
      return;
	  })
  }
}

/*
with a text for your tweet status,
and one or more poll entries,
and optionally a duration for the poll (defaulting to 1 day),
create a tweet with the poll and return the tweet response.
*/
function postPoll(statustext, entries, duration) {
  var params = {
	  "twitter:api:api:endpoint": "1",
	  "twitter:card": "poll" + entries.length + "choice_text_only",
	  "twitter:long:duration_minutes": duration || 1440, //default 1-day
  };

  if(entries.length < 2) {
	  throw "Must have at least two poll entries";
  }
  if(entries.length > 4) {
  	throw "Too many poll entries (max 4)";
  }

  entries.forEach(
		 function(val, i) {
		     params["twitter:string:choice" + (i + 1) + "_label"] = val;
		 }
	);

  return Q(oauth).ninvoke(
    "post",
    'cards/create',
    {
	"card_data" : JSON.stringify(params)
    }
  ).then(function(pack) {
    var data = pack[0];
    if(data.status === "FAILURE") {
      throw pack;
    } else {
      return data;
    }
  }, function(err) {
    console.error("Error on creating twitter card");
    console.error(err);
  }).then(function(data) {
    return Q(oauth).ninvoke(
      "post",
      "statuses/update",
      {
			  "status": statustext, 
				"card_uri": data.card_uri,
				"include_cards": 1,
				"cards_platform": "iPhone-13",
				"contributor_details": 1
			}
		).then(function(pack) {
      return pack[0];		
		}, function(err) {
      console.error("Error on posting tweet");
 	    console.error(err);
		});
	});
}

/*
This is the structure of a tweet's "card" object.
Where you see # below it is a number from 1-4 (the same number in each case)
Where you see % below it repeats for each number from 1 to the value of #

"card":
  "name":"poll#choice_text_only",
  "url":"",  // format is "card://<a twitter id>"
  "card_type_url":"http://card-type-url-is-deprecated.invalid",
  "binding_values":  
    "choice%_label":  // there is one of these for each choice
       "type":"STRING",
       "string_value":""  //value is whatever text you supplied for the choice
  "end_datetime_utc":
    "type":"STRING",
    "string_value":"2016-02-05T00:53:48Z"
  "counts_are_final":
    "type":"BOOLEAN",
    "boolean_value":false  // this is true after the poll is over
  "choice%_count":
    "type":"STRING",
    "string_value":"0"
  "last_updated_datetime_utc":
    "type":"STRING",
    "string_value":"2016-02-04T00:54:05Z"
  "duration_minutes":
    "type":"STRING",
    "string_value":"1440" // this would be a 1-day poll
  "api":
    "type":"STRING",
    "string_value":"capi://passthrough/1"
  "card_url":
    "type":"STRING",
    "string_value":"https://twitter.com",
    "scribe_key":"card_url"
*/
function getCard(tweet) {
  return Q(oauth).ninvoke(
    "get",
    'statuses/show/' + tweet.id_str, 
	  {
    	cards_platform: "iPhone-13",
		  include_cards: 1,
		},
	).then(function(pack) {
	  var data = pack[0];
    return data.card;	  
	}, function(err) {
		  console.error("Error getting card data");
		  console.error(err);
	});
}

postPoll(
  "This is a poll I'm trying out",
  ["I like it", "I don't like it"]
).then(getCard)
 .then(function(card) {
  console.log(card);
});