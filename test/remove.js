var level = require('level-test')({ mem: true });
var Trie = require('..');
var test = require('tape');
var through = require('through');

test('remove', function (t) {
  t.plan(4);
  var trie = Trie(level('remove'));

  trie.add('foo', function (err) {
    t.error(err);
    trie.db.get('foo', function (err) {
      t.error(err);
      trie.remove('foo', function (err) {
        t.error(err);
        trie.db.get('foo', function (err) {
          t.ok(err);
        });
      });
    });
  });
});
