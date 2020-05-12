# pn
[![NPM][NPM1]][NPM2]

[![Build Status][1]][2]

The `pn` library gives you the Promise-using node standard library
you've always dreamed of.  Think "Promised Node" when saying it.

Just about every node standard library method that takes a callback will now
return a `Promise` iff no callback is supplied.  But existing code
that passes callbacks will still work fine --- and fast:  No unnecessary
`Promise`s are created if you supply a callback.

The wrappers are generated automatically by a script, with a table to
handle exceptions and odd cases.  See below for more details.

## Installation
```
npm install pn
```
## Usage
```
var fs = require('pn/fs');
fs.writeFile('foo', 'bar', 'utf-8').then(function() { console.log('done'); });
// But you can use callbacks, too -- existing code won't break.
fs.writeFile('foo', 'bat', 'utf-8', function(err) { console.log('yay'); });
```

This library uses node native promises (ie `global.Promise`) by
default, and thus works with node >= 0.11.

You can use [`core-js`](https://www.npmjs.org/package/core-js) or
[`es6-shim`](https://www.npmjs.org/package/es6-shim)
to add ES6 Promises to earlier versions of node, for example:
```
require('es6-shim');
var fs = require('pn/fs');
```
Just be sure that `es6-shim` is loaded before the `pn` package in that
case.

You might also want to look into packages like
[`prfun`](https://www.npmjs.org/package/prfun)
which add some helpers to make working with native promises much more
fun.

In particular, the `Promise#done` method is very useful when
debugging, at least until v8's native Promise debugging
capabilities are completed.

## Custom Promise types

You can also specify a custom `Promise` type to use, as follows:
```
var MyPromise = require('prfun');  // Use prfun's Promises, for example.
require('pn/_promise')(MyPromise); // This only needs to be done once.
```

## Exceptions and odd cases

The wrappers are automatically generated by `scripts/generate.js`;
there is a table in that file which specifies all the odd cases.

In general: if the node API has a callback which takes multiple
value arguments, the `Promise` returned will be an object with
named fields corresponding to the different values. If the node
API takes a callback *and* returns a value, `pn` will return
the original value with a nonenumerable field named `promise`
corresponding to the callback.  Combining these two cases:
```
var child_process = require('pn/child_process');
var cp = child_process.execFile('true');
console.log('pid', cp.pid);
cp.promise.then(function(result) {
  console.log('stdout: ', result.stdout);
  console.log('stderr: ', result.stderr);
});
```

* `child_process`: The `exec` and `execFile` methods promise a object
  with fields named `stdout` and `stderr`.  They return a `ChildProcess`
  object with a nonenumerable field named `promise` corresponding to the
  callback.
* `crypto`: The `randomBytes` and `pseudoRandomBytes` methods are
  now always asynchronous, returning a `Promise` if no callback
  is supplied.  Use the new `randomBytesSync` and `pseudoRandomBytesSync`
  methods if you want synchronous computation.  *This is backwards
  incompatible with existing node code.*
* `dns`: The `lookupService` method promises an object with
  fields named `hostname` and `service`.
* `fs`: The `exists` method doesn't pass an error to its callback.
  The promisied version will never reject.  The `write` method promises
  an object with fields named `written` and `data`.  The `read` method
  promises an object with fields named `read` and `data`.
* `http`, `https`: The `request` and `get` methods return a `ClientRequest`
  object with a nonenumerable field named `promise`, which will
  resolve to an `IncomingMessage` object.
* `process`: You can defer computation to the next tick with
  `require('pn/process').nextTick().then(function(){...})`
* `tls`: The `connect` and `createServer` return objects with a
  nonenumerable field named `promise`.

There are a few object methods which are not promisified by this
package:
* `domain`: `Domain#bind`, `Domain#intercept`
* `http`,`https`: `ClientRequest#setTimeout`, `IncomingMessage#setTimeout`,
  `Server#setTimeout`, `ServerResponse#setTimeout`, `Server#listen`,
  `Server#close`
* `net`: `Server#listen`, `Server#close`, `Server#getConnections`,
  `Socket#write`, `Socket#setTimeout`
* `readline`: `Interface#question`
* `stream`: `Writable#write`, `Writable#end`
* `dgram`: `Socket#send`, `Socket#bind`.

## Related packages

Here are some other packages with similar aims:
* [`promised-node`](https://www.npmjs.org/package/promised-node)
* [`then-fs`](https://www.npmjs.org/package/then-fs)
* [`final-fs`](https://www.npmjs.org/package/final-fs)

## License

Copyright (c) 2014-2018 C. Scott Ananian

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

[NPM1]: https://nodei.co/npm/pn.png
[NPM2]: https://nodei.co/npm/pn/

[1]: https://travis-ci.org/cscott/node-pn.svg
[2]: https://travis-ci.org/cscott/node-pn