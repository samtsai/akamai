var chai = require('chai') //actually call the the function
  , request = require('request')
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai')
  , akamai = require('../akamai')
  , fileList
  , opts
  , auth
  , purgeId
  , stub
  , response = {
      authFail : {
        err : null,
        response : {
          statusCode : 401
        },
        body : null
      },
      success : {
        purgeRequest : {
          err : null,
          response : {
            statusCode : 201
          },
          body : {
            httpStatus : 201,
            detail : 'Request accepted.',
            estimatedSeconds : 420,
            purgeId : '95b5a092-043f-4af0-843f-aaf0043faaf0',
            progressUri : '/ccu/v2/purges/95b5a092-043f-4af0-843f-aaf0043faaf0',
            pingAfterSeconds : 420,
            supportId : '17PY1321286429616716-211907680'
          }
        },
        purgeStatus : {
          err : null,
          response : {
            statusCode : 200
          },
          body : {
            originalEstimatedSeconds : 480,
            progressUri : '/ccu/v2/purges/142eac1d-99ab-11e3-945a-7784545a7784',
            originalQueueLength: 6,
            purgeId: '142eac1d-99ab-11e3-945a-7784545a7784',
            supportId: '17SY1392844709041263-238396512',
            httpStatus: 200,
            completionTime: null,
            submittedBy: 'test1',
            purgeStatus: 'In-Progress',
            submissionTime: '2014-02-19T21:16:20Z',
            pingAfterSeconds: 60
          }
        },
        queue : {
          err : null,
          response : {
            statusCode : 200
          },
          body : {
            httpStatus : 200,
            queueLength : 17,
            detail : 'The queue may take a minute to reflect new or removed requests.',
            supportId : "17QY1321286863376510-220300384"
          }
        }
      }
    };

chai.should();
chai.use(sinonChai);

describe('Akamai Library', function() {

  beforeEach(function() {
    fileList = ['path/to/file'];
    opts = { 'type': 'arl', 'domain': 'production', 'action': 'remove' };
    auth = { 'username' : 'username', 'password' : 'password' };
    purgeId = '95b5a092-043f-4af0-843f-aaf0043faaf0';
  })

  afterEach(function() {
    if (request.post.restore) {
      request.post.restore();
    }
    if (request.get.restore) {
      request.get.restore();
    }
  })

  describe('flush', function() {
    it('should have a flush function', function() {
      akamai.should.have.property('flush');
      akamai.flush.should.be.a('function');
    });

    it('should expect credentials', function() {
      try {
        auth = null;
        akamai.flush(fileList, opts, auth);
      } catch (err) {
        err.should.match(/Auth required/);
      }
    });

    it('should expect a file list', function() {
      try {
        fileList = null;
        akamai.flush(fileList, opts, auth);
      } catch (err) {
        err.should.match(/File list required/);
      }
    });

    it('should extend request options' , function() {
      stub = sinon.stub(request, 'post');
      opts.domain = 'staging';
      var exptectedOpts = {
        json: { domain: 'staging' }
      };

      akamai.flush(fileList, opts, auth);
      request.post.should.be.calledWithMatch(exptectedOpts);
    });

    it('should give me unauthorized error when no valid credentials is passed', function(done) {
      stub = sinon.stub(request, 'post');
      stub.yields(
        response.authFail.err,
        response.authFail.response,
        response.authFail.body);

      akamai.flush(fileList, opts, auth, function(error, response, body) {
        response.statusCode.should.equal(401);
        done();
      });
    });

    it('should return purge request information', function(done) {
      stub = sinon.stub(request, 'post');
      stub.yields(
        response.success.purgeRequest.err,
        response.success.purgeRequest.response,
        response.success.purgeRequest.body);

      akamai.flush(fileList, opts, auth, function(error, response, body) {
        response.statusCode.should.equal(201);
        body.purgeId.should.be.ok;
        done();
      });
    });

  });

  describe('flushStatus', function() {

    akamai.should.have.property('flush');
    akamai.flush(singleFile, {}, auth);
  });

  describe('queue', function() {

    it('should have a queue function', function() {
      akamai.should.have.property('queue');
      akamai.queue.should.be.a('function');
    });

    it('should expect credentials', function() {
      try {
        auth = null;
        akamai.queue(opts, auth);
      } catch (err) {
        err.should.match(/Auth required/);
      }
    });

    it('should extend request options' , function() {
      stub = sinon.stub(request, 'get');
      opts.domain = 'staging';
      var exptectedOpts = {
        json: { domain: 'staging' }
      };

      akamai.queue(opts, auth);
      request.get.should.be.calledWithMatch(exptectedOpts);
    });

    it('should give me unauthorized error when no valid credentials is passed', function(done) {
      stub = sinon.stub(request, 'get');
      stub.yields(
        response.authFail.err,
        response.authFail.response,
        response.authFail.body);
      akamai.queue(opts, auth, function(error, response, body) {
        response.statusCode.should.equal(401);
        done();
      });
    });

    it('should return queue information', function(done) {
      stub = sinon.stub(request, 'get');
      stub.yields(
        response.success.queue.err,
        response.success.queue.response,
        response.success.queue.body);

      akamai.queue(opts, auth, function(error, response, body) {
        response.statusCode.should.equal(200);
        body.queueLength.should.be.ok;
        done();
      });
    });

  });

});
