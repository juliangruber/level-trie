var level = require('level-test')({ mem: true });
var Trie = require('..');
var test = require('tape');
var through = require('through');

test('follow', function (t) {
  t.plan(2);
  var trie = Trie(level());

  trie.add('bar');

  var rs = trie.createSearchStream('fabulous', { follow: true });
  rs.on('data', console.log.bind(null, 'got'))

  rs.once('data', function (str) {
    t.equal(str, 'bar');
    rs.once('data', function (str) {
      t.equal(str, 'foo');
    });
    trie.add('foo');
  });
});
