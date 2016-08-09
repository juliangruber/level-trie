var level = require('level-test')({ mem: true });
var Trie = require('..');
var test = require('tape');
var through = require('through');

test('search stream', function (t) {
  t.plan(1);
  var trie = Trie(level('search-stream'));

  trie.add('foo');
  trie.add('bar');
  trie.add('baz');

  var res = [];
  trie.createSearchStream('fabulous')
    .pipe(through(write, end));

  function write (str) { res.push(str) }
  function end () { t.equal(res[0], 'foo') }
});
