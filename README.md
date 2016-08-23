sizeable [![NPM Version](https://img.shields.io/npm/v/sizeable.svg?style=flat)](https://www.npmjs.com/package/sizeable)
========

Get the size of a folder by iterating through its subfiles and folders


Installing
----------

#### Local

```bash
npm i sizeable
```

#### Global

```bash
npm i -g sizeable
```


Usage
-----

```js
var sizeable = require('sizeable');

sizeable(myFolderPath, [ignoreRegexPattern], callback);
```

Example:

```js
var sizeable = require('sizeable');
var folder = '/my/folder/path';

sizeable(folder, function callback(err, size, details) {
    if (err) {
        throw err;
    }

    console.log(size, 'bytes');
    console.log(sizeable.toKb(size), 'Kb');
    console.log(sizeable.toMb(size), 'Mb');
    console.log(sizeable.toGb(size), 'Gb');
    console.log(sizeable.toTb(size), 'Tb');

    console.log(sizeable.toFormat(size, 'b'), 'bytes');
    console.log(sizeable.toFormat(size, 'kb'), 'Kb'); // Valid format 'b', 'kb', 'mb', 'gb' and 'tb' (Ignore case)
});
```

```js
var sizeable = require('sizeable');
var folder = '/my/folder/path';
var ignore = /node_modules/;

sizeable(folder, ignore, function callback(err, size, details) {
    if (err) {
        throw err;
    }

    sizeable.detailsSizeTo(details, 'mb', function(err, details) {
        if (err) {
            throw err;
        }
        console.log(JSON.stringify(details, null, 2));
    });
});
```


CLI tool
--------

```bash
sizeable -f /my/folder/path -i "node_modules|.git"

# ~> 12.32 mb
```

```bash
sizeable -f /my/folder/path -i "node_modules|.git" -F gb

# ~> 0.12 gb
```

For show more information use -h
```bash
sizeable -h
```


License
-------

MIT
