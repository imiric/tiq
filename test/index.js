
/**
 * Module dependencies.
 */

var tiq = require('../tiq'),
    should = require('chai').should();

describe('associate', function() {
  it('should associate tags with tokens', function() {
    var store = tiq.associate(['john'], ['hello', 'yes']);
    store.should.deep.equal({
      'john': ['hello', 'yes'],
      'hello': ['john'],
      'yes': ['john']
    });
  })

  it('should associate tags with tokens using namespaces', function() {
    var store = tiq.associate(['john'], ['hello', 'yes'], 'private');
    store.should.deep.equal({
      'private:::john': ['hello', 'yes'],
      'private:::hello': ['john'],
      'private:::yes': ['john']
    });
  })

  it('should associate only unique values', function() {
    var store = tiq.associate(['john'], ['hello', 'yes']);
    store = tiq.associate(['another'], ['john', 'peter'], null, store);
    store.should.deep.equal({
      'john': ['hello', 'yes', 'another'],
      'hello': ['john'],
      'yes': ['john'],
      'another': ['john', 'peter'],
      'peter': ['another']
    });
  })
});

describe('describe', function() {
  beforeEach(function() {
    this.currentTest.data = {
      'peter': ['what'],
      'what': ['peter'],
      'private:::nope': ['peter'],
      'private:::peter': ['nope']
    };
  })

  it('should return the tags associated with the tokens', function() {
    var store = this._runnable.data;
    tiq.describe(['what'], null, store).should.deep.equal(['peter']);
    tiq.describe(['peter'], null, store).should.deep.equal(['what']);
  })

  it('should return the tags associated with the tokens using namespaces', function() {
    var store = this._runnable.data;
    tiq.describe(['nope'], 'private', store).should.deep.equal(['peter']);
    tiq.describe(['peter'], 'private', store).should.deep.equal(['nope']);
  })
});
