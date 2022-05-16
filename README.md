# level-trie

The [TRIE](http://en.wikipedia.org/wiki/Trie) data structure and search
algorithm, on top of [leveldb](https://github.com/rvagg/node-levelup).

[![build status](https://secure.travis-ci.org/juliangruber/level-trie.svg)](http://travis-ci.org/juliangruber/level-trie)
[![downloads](https://img.shields.io/npm/dm/level-trie.svg)](https://www.npmjs.org/package/level-trie)

## Usage

Store some words in a trie, then query them:

```js
var level = require('level');
var Trie = require('level-trie');
var db = level(__dirname + '/db');

var trie = new Trie(db);

trie.add('bar');
trie.add('baz');
trie.add('foo');

trie.createSearchStream('fabulous')
  .on('data', console.log);
  // => foo
  // => bar
  // => baz
```

## API

### Trie(db)

Create a new `Trie` that stores its data in `db`.

If you don't want to use a whole database for the trie, pass in a
database's section using
[level-sublevel](https://github.com/dominictarr/level-sublevel).

### Trie#add(string[, fn])

Add `string` to the trie.

### Trie#remove(string[, fn])

Remove `string` from the trie.

### Trie#createSearchStream(string, options)

Create a readable `Stream` that emits all the strings stored in the trie,
ordered by size of the common prefix. Abort reading with `stream#end` or use
the `limit` option.

Possible options are:

* `limit`: Emit max. x entries.
* `follow`: Keep the stream open and emit new data that comes in. When used in
conjunction with `limit` the last emitted historical entry will define the
border of what a new entry that's emitted needs to fit in, e.g. it mustn't be
further away from the search string.

## Installation

With [npm](http://npmjs.org) do:

```bash
$ npm install level-trie
```

## License

Copyright (c) 2013 Julian Gruber &lt;julian@juliangruber.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
