var should = require('chai').should() //actually call the the function
  , akamai = require('../akamai');

describe('Akamai Library', function() {
  it('should have a flush function', function() {
    akamai.should.have.property('flush');
  });

  it('should have a flushStatus function', function() {
    akamai.should.have.property('flushStatus');
  });

  it('should have a queue function', function() {
    akamai.should.have.property('queue');
  });
});
