var through = require('through2');
var shutup = require('shutup');
var liveStream = require('level-live-stream');

module.exports = Trie;

function Trie (db) {
  if (!(this instanceof Trie)) return new Trie(db);
  this.db = db;
}

Trie.prototype.add = function (str, fn) {
  this.db.put(str, ' ', fn);
};

Trie.prototype.remove = function (str, fn) {
  this.db.del(str, fn);
};

Trie.prototype.createSearchStream = function (key, opts) {
  if (!opts) opts = {};

  var db = this.db;
  var found = [];
  var limit = typeof opts.limit != 'undefined'? opts.limit : Infinity;
  var outer = shutup(through.obj());

  function read (key, follow) {
    var _opts = { start: key, values: false, old: true };
    var ks = follow
      ? liveStream(db, _opts)
      : db.createReadStream(_opts);
    var inner = through.obj(write, end);

    function write (str, _, cb) {
      if (str.type && str.type == 'put') str = str.key;
      if (found.indexOf(str) != -1) return cb();
      found.push(str);
      inner.push(str);
      if (found.length == limit && !follow) {
        ks.destroy();
        ks.push(null);
      }
      cb()
    }

    // only called when !follow
    function end (cb) {
      if (opts.follow) {
        // keep listening for new data
        read(key, true);
      }
      if (key.length > 0 && found.length < limit) {
        // go further up the tree for more data
        read(key.substr(0, key.length - 1));
      } else if (!opts.follow) {
        outer.end();
      }
      cb()
    }

    ks.pipe(inner).pipe(outer, { end: false });
    outer.on('end', ks.destroy.bind(ks));
  }

  process.nextTick(function () {
    read(key);
  });

  return outer;
};

