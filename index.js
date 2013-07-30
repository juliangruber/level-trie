var through = require('through');
var shutup = require('shutup');

module.exports = Trie;

function Trie (db) {
  if (!(this instanceof Trie)) return new Trie(db);
  this.db = db;
}

Trie.prototype.add = function (str, fn) {
  this.db.put(str, ' ', fn);
};

Trie.prototype.createSearchStream = function (key, opts) {
  if (!opts) opts = {};

  var db = this.db;
  var found = [];
  var limit = typeof opts.limit != 'undefined'? opts.limit : Infinity;
  var outer = shutup(through());
  // todo: use pull-streams

  function read (key) {
    var ks = db.createKeyStream({ start: key });
    var inner = through(write, end);

    function write (str) {
      if (found.indexOf(str) != -1) return;
      if (found.length < limit) {
        found.push(str);
        inner.queue(str);
      } else {
        ks.destroy();
      }
    }
    function end () {
      key.length > 0 && found.length < limit
        ? read(key.substr(0, key.length - 1))
        : outer.end();
    }

    ks.pipe(inner).pipe(outer, { end: false });
  }
  
  process.nextTick(function () {
    read(key);
    // todo: or use setImmediate
  });

  return outer;
};

