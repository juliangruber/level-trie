var level = require('level-test')({ mem: true });
var Trie = require('..');
var test = require('tape');
var through = require('through');

test('end', function (t) {
  t.plan(1);
  var trie = Trie(level('end'));

  trie.add('foo');
  trie.add('bar');
  trie.add('baz');

  var res = [];
  var rs = trie.createSearchStream('fabulous');
  rs.pipe(through(write, end));

  function write (str) {
    res.push(str);
    if (res.length > 0) rs.end();
  }
  function end () { t.deepEqual(res, ['foo']) }
});
