var level = require('level-test')({ mem: true });
var Trie = require('..');
var test = require('tape');

test('follow', function (t) {
  t.plan(2);

  var trie = Trie(level('follow'));
  trie.add('bar');
  var rs = trie.createSearchStream('fabulous', { follow: true });

  rs.once('data', function (str) {
    t.equal(str, 'bar');
    rs.once('data', function (str) {
      t.equal(str, 'foo');
    });
    trie.add('foo');
  });
});
