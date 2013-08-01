var through = require('through');
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

Trie.prototype.createSearchStream = function (key, opts) {
  if (!opts) opts = {};

  var db = this.db;
  var found = [];
  var limit = typeof opts.limit != 'undefined'? opts.limit : Infinity;
  var outer = shutup(through());

  function read (key, follow) {
    var _opts = { start: key, values: false, old: false };
    var ks = follow
      ? liveStream(db, _opts)
      : db.createReadStream(_opts);
    var inner = through(write, end);

    function write (str) {
      if (str.type && str.type == 'put') str = str.key;
      if (found.indexOf(str) != -1) return;
      found.push(str);
      inner.queue(str);
      if (found.length == limit && !opts.follow) ks.destroy();
    }

    // only called when !follow
    function end () {
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
    }

    ks.pipe(inner).pipe(outer, { end: false });
    outer.on('end', ks.destroy.bind(ks));
  }

  process.nextTick(function () {
    read(key);
    // todo: or use setImmediate
  });

  return outer;
};

