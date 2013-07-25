var level = require('level-test')({ mem: true });
var Trie = require('..');
var test = require('tape');

test('readable', function (t) {
  t.plan(2);
  var trie = Trie(level());
  var rs = trie.createSearchStream('');
  t.ok(rs.readable);
  t.notOk(rs.writable);
});
