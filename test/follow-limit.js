var level = require('level-test')({ mem: true });
var Trie = require('..');
var test = require('tape');
var through = require('through');

test('follow with limit', function (t) {
  t.plan(2);

  var trie = Trie(level('follow-limit'));
  trie.add('bar');
  var rs = trie.createSearchStream('fabulous', {
    follow: true,
    limit: 1
  });

  rs.once('data', function (str) {
    t.equal(str, 'bar');
    rs.once('data', function (str) {
      t.equal(str, 'foo');
    });
    trie.add('aaa');
    trie.add('foo');
  });
});
