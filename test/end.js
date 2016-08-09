var level = require('level-test')({ mem: true });
var Trie = require('..');
var test = require('tape');
var through = require('through2');

test('end', function (t) {
  t.plan(1);
  var trie = Trie(level('end'));

  trie.add('foo');
  trie.add('bar');
  trie.add('baz');

  var res = [];
  var rs = trie.createSearchStream('fabulous');
  rs.pipe(through.obj(write, end));

  function write (str, _, cb) {
    res.push(str);
    if (res.length > 0) rs.end();
    cb();
  }
  function end (cb) {
    t.deepEqual(res, ['foo']);
    cb();
  }
});
