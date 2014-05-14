var should = require('chai').should() //actually call the the function
  , akamai = require('../akamai')
  , auth
  , singleFile = 'http://dummy-url.com/flush-me.txt'
  , multiFiles = [
    'http://dummy-url.com/flush-me.txt',
    'http://dummy-url.com/flush-me-next.txt',
    'http://dummy-url.com/flush-me-last.txt'
  ];

describe('Akamai Library', function() {
  beforeEach(function() {
    auth = {
      'username': 'test@test.com',
      'password': '@kamai'
    };
  });

  it('should require auth to perform any request', function() {
    // empty out auth
    auth = {};

    (function() {
      akamai.flush()
    }).should.throw(Error);

    (function() {
      akamai.flushStatus()
    }).should.throw(Error);

    (function() {
      akamai.queue()
    }).should.throw(Error);
  });

  it('should handle flushing one file', function( done ) {

    akamai.should.have.property('flush');
    akamai.flush(singleFile);
  });

  it('should have a flushStatus function', function() {
    akamai.should.have.property('flushStatus');
  });

  it('should have a queue function', function() {
    akamai.should.have.property('queue');
  });
});
