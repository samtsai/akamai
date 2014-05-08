'use strict';

var request = require('request'),
    extend = require('util-extend');

var host = 'https://api.ccu.akamai.com/ccu/v2/';
var apiDefaults = {
  'purge': {
    'route': 'queues/default',
    'method': 'POST'
  },
  'status': {
    'route': 'purges/',
    'method': 'GET'
  },
  'queue': {
    'route': 'queues/default',
    'method': 'GET'
  }
};

/*
[Akamai API](https://api.ccu.akamai.com/ccu/v2/docs/index.html)

Purge Request (POST api.ccu.akamai.com/ccu/v2/queues/default)
Submits a request to purge Edge content represented by one or more ARLs/URLs or one or more CP codes. The Akamai network then processes the requests looking for matching content. If the network finds matching content, it is either removed or invalidated, as specified in the request.

Purge Status (GET api.ccu.akamai.com/ccu/v2/purges/<purgeId>)
Each purge request returns a link to the status information for that request. Use the Purge Status API to request that status information.

Queue Length (GET api.ccu.akamai.com/ccu/v2/queues/default)
Returns the number of outstanding objects in the user's queue.
*/
function purgeRequest( fileList, options, auth, done ) {
  //makeRequest('purge', )
  var apiDef = apiDefaults['purge'];
  var requestUri = host + apiDef.route;
  var requestOpts;
  var opts = {
    'type': 'arl',
		'domain': 'production',
		'action': 'remove'
  };

	if (!auth) {
		throw new Error('No credentials, no access... Auth required');
	}

  if (!fileList) {
    throw new Error('Nothing to flush... File list required');
  } else if (typeof fileList === 'string') {
    // convert to an array
    fileList = fileList.split('');
  }

  if (options && typeof options === 'object') {
    opts = extend(opts, options);
  }

  opts.objects = fileList;

  requestOpts = {
    'uri': requestUri,
    'method': apiDef.method,
		'auth': auth,
    'json': opts
  };

  console.log('request options', requestOpts);

  request(requestOpts, function (error, response, body) {
    if(response.statusCode == 201){
			done(body);
    } else {
      console.log('error: '+ error + ' with response status code ' + response.statusCode)
      console.log('body: ' + body);
    }
  });
}

function purgeStatus( ) {

}

function queueLength( ) {

}

module.exports = {
  flush: purgeRequest,
  flushStatus: purgeStatus,
  queue: queueLength
};
