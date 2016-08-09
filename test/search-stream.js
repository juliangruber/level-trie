var level = require('level-test')({ mem: true });
var Trie = require('..');
var test = require('tape');
var through = require('through2');

test('search stream', function (t) {
  t.plan(1);
  var trie = Trie(level('search-stream'));

  trie.add('foo');
  trie.add('bar');
  trie.add('baz');

  var res = [];
  trie.createSearchStream('fabulous')
    .pipe(through.obj(write, end));

  function write (str, _, cb) {
    res.push(str);
    cb();
  }
  function end (cb) {
    t.equal(res[0], 'foo');
    cb();
  }
});
