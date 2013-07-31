var level = require('level-test')({ mem: true });
var Trie = require('..');
var test = require('tape');
var through = require('through');

test('follow with limit 2', function (t) {
  t.plan(3);

  var trie = Trie(level());
  trie.add('bar');
  var rs = trie.createSearchStream('fabulous', {
    follow: true,
    limit: 3
  });

  var found = 0;
  rs.on('data', function (d) {
    if (found == 0) { t.equal(d, 'bar'); trie.add('aaa'); }
    if (found == 1) { t.equal(d, 'aaa'); trie.add('foo'); }
    if (found == 2) { t.equal(d, 'foo'); }
    found++;
  });
});
