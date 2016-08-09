var level = require('level-test')({ mem: true });
var Trie = require('..');
var test = require('tape');
var through = require('through');

test('deterministic', function (t) {
  t.plan(1);
  var trie = Trie(level('deterministic'));

  trie.add('foo');
  trie.add('foo');

  var res = [];
  trie.createSearchStream('foo')
    .pipe(through(write, end));

  function write (str) { res.push(str) }
  function end () { t.deepEqual(res, ['foo']) }
});
