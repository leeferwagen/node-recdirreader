# node-recdirreader

Recursive Directory Reader for Node.js

## Installation

#### Node.js

    $ npm install recdirreader

## Methods

```js
RecDirReader ( dir: Array ): RecDirReader
RecDirReader ( dir: String ): RecDirReader
RecDirReader ( dir: Array, filter: RegExp ): RecDirReader
RecDirReader ( dir: String, filter: RegExp ): RecDirReader
RecDirReader.dir ( dir: Array ): RecDirReader
RecDirReader.dir ( dir: String ): RecDirReader
RecDirReader.filter ( filter: RegExp ): RecDirReader
```

## Events

##### Every event listener (except of `error`) becomes two arguments passed: the `file path` and the `fs.Stat` object
The following event names are available:
- `directory` for directories
- `file` for files
- `symboliclink` for symlinks
- `blockdevice` for block devices
- `characterdevice` for character devices
- `fifo` for named pipes
- `socket` for sockets
- `any` for any of above event
- `empty` for empty directories



## Examples

##### How to include:

```js
    var RecDirReader = require('recdirreader');
```

##### Let's start with this simple piece of code, which prints simply all files from `/home/myname`:

```js
    RecDirReader('/home/myname').on('file', function(file, stat) {
      // print file path and size
      console.log('File: ' + file + ' (' + stat.size + ')');
    }).scan();
```

##### Alternatively you can pass the directory `/home/myname` directly to the scan() method:

```js
    RecDirReader().on('file', function(file, stat) {
      console.log('File: ' + file + ' (' + stat.size + ')');
    }).scan('/home/myname');
```

##### As you can see: both, RecDirReader() and its scan() method accept a directory string as first argument. But you can also pass an Array with Strings. Like in the following example:

```js
    RecDirReader(['/home/myname/Pictures', '/home/myname/Videos'])
      .on('file', function(file) {
        console.log('File:', file);
      }).scan();
```

##### How about filters? Let's say you want to have only `*.jpg` or `*.png` files from `/home/myname/Pictures`:

```js
    RecDirReader('/home/myname/Pictures',  /\.(jpg|png)$/).on('file', function(file, stat) {
      console.log('Picture found:', file);
    }).scan();
```

##### RecDirReader emits an event for every file type. So you can listen to the `directory`, `file`, `symboliclink`, `blockdevice`, `characterdevice`, `fifo`, or `socket` event.

##### If you want to have only directories, listen to the `directory` event:

```js
    RecDirReader().on('directory', function(file) {
      console.log('Directory found:', file);
    }).scan('/home/myname');
```

##### Get only symbolic links:

```js
    RecDirReader().on('symboliclink', function(file) {
      console.log('Symlink found:', file);
    }).scan('/home/myname');
```

##### Get all empty directories:

```js
    var emptyDirectories = [];
    RecDirReader().on('empty', function(dir) {
      emptyDirectories.push(dir);
    }).on('end', function() {
      console.log('Empty Directories:', emptyDirectories);
    }).scan('/home/myname');
```

##### Or you just listen to the `any` event, which is emitted by any type of file, inclusively directories:

```js
    RecDirReader().on('any', function(file) {
      console.log(file);
    }).scan('/home/myname');
```
