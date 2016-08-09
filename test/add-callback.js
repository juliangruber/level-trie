var level = require('level-test')({ mem: true });
var Trie = require('..');
var test = require('tape');

test('add callback', function (t) {
  t.plan(1);
  var trie = Trie(level('add-callback'));

  trie.add('foo', function (err) {
    t.error(err);
  });
});
