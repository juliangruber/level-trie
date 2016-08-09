var level = require('level-test')({ mem: true });
var Trie = require('..');
var test = require('tape');
var through = require('through2');

test('deterministic', function (t) {
  t.plan(1);
  var trie = Trie(level('deterministic'));

  trie.add('foo');
  trie.add('foo');

  var res = [];
  trie.createSearchStream('foo')
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
