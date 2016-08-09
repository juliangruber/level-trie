var level = require('level-test')({ mem: true });
var Trie = require('..');
var test = require('tape');
var through = require('through2');

test('limit', function (t) {
  t.plan(1);
  var trie = Trie(level('limit'));

  trie.add('foo');
  trie.add('bar');
  trie.add('baz');

  var res = [];
  trie.createSearchStream('fabulous', { limit: 1 })
    .pipe(through.obj(write, end));

  function write (str, _, cb) {
    res.push(str);
    cb();
  }
  function end (cb) {
    t.deepEqual(res, ['foo']);
    cb();
  }
});
