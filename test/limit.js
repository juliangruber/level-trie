var level = require('level-test')({ mem: true });
var Trie = require('..');
var test = require('tape');
var through = require('through');

test('limit', function (t) {
  t.plan(1);
  var trie = Trie(level());

  trie.add('foo');
  trie.add('bar');
  trie.add('baz');

  var res = [];
  trie.createSearchStream('fabulous', { limit: 1 })
    .pipe(through(write, end));

  function write (str) { res.push(str) }
  function end () { t.deepEqual(res, ['foo']) }
});
