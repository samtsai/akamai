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

/*
Response
{
   "httpStatus" : 201,
   "detail" : "Request accepted.",
   "estimatedSeconds" : 420,
   "purgeId" : "95b5a092-043f-4af0-843f-aaf0043faaf0",
   "progressUri" : "/ccu/v2/purges/95b5a092-043f-4af0-843f-aaf0043faaf0",
   "pingAfterSeconds" : 420,
   "supportId" : "17PY1321286429616716-211907680"
}
*/
function purgeRequest( fileList, options, auth, done ) {

  var apiDef = apiDefaults.purge;
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

  request.post(requestOpts, function (error, response, body) {
    if (done) {
      done(error, response, body);
    }
  });
}

function purgeStatus(purgeId, auth, done) {

  var apiDef = apiDefaults.status;
  var requestUri = host + apiDef.route + purgeId;
  var requestOpts;

  if (!auth) {
    throw new Error('No credentials, no access... Auth required');
  }

  if (!purgeId) {
    throw new Error('A purge id is needed to check status');
  }

  requestOpts = {
    'uri': requestUri,
    'method': apiDef.method,
    'auth': auth
  };

  request.get(requestOpts, function (error, response, body) {
    if (done) {
      done(error, response, body);
    }
  });
}

function queueLength(options, auth, done) {

  var apiDef = apiDefaults.queue;
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

  if (options && typeof options === 'object') {
    opts = extend(opts, options);
  }

  requestOpts = {
    'uri': requestUri,
    'method': apiDef.method,
    'auth': auth,
    'json': opts
  };

  request.get(requestOpts, function (error, response, body) {
    if (done) {
      done(error, response, body);
    }
  });
}

module.exports = {
  flush: purgeRequest,
  flushStatus: purgeStatus,
  queue: queueLength
};
