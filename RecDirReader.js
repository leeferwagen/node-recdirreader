'use strict';

var lstat = require('fs').lstat;
var readdir = require('fs').readdir;
var isArray = require('util').isArray;
var joinPath = require('path').join;



/**
 * Constructor
 *
 * @param String {dir} (optional)
 * @param RegExp {filter} (optional)
 */

function RecDirReader(dir, filter) {
  if (this === undefined) return new RecDirReader(dir, filter);
  this._wc = 0;
  this._dir = dir || '.';
  this._filter = filter || /.*/;
}

require('util').inherits(RecDirReader, require('events').EventEmitter);

/**
 * Set filter RegExp.
 *
 * @param RegExp {filter} (optional)
 * @return RecDirReader
 */
RecDirReader.prototype.filter = function(filter) {
  this._filter = filter;
  return this;
};

/**
 * Set directory to {dir}.
 *
 * @param String {dir}
 * @return RecDirReader
 */
RecDirReader.prototype.dir = function(dir) {
  this._dir = dir;
  return this;
};

/**
 * Decrease the Wait Counter and emit the "end" event if it reaches 0.
 */
RecDirReader.prototype._decreaseWaitCount = function() {
  if (--this._wc === 0) this.emit('end');
};

/**
 * Emit an "error" event if there's a listener for the "error" event.
 *
 * @param Error {err}
 */
RecDirReader.prototype._emitError = function(err) {
  if (this._events.hasOwnProperty('error')) this.emit('error', err);
};


/**
 * Start directory scan.
 *
 * @param String dir
 * @return RecDirReader
 */
RecDirReader.prototype.scan = function(dir) {
  var self = this;

  // Use the standard directory if {dir} is not set.
  if (dir === undefined) dir = this._dir;

  // Consider, that {dir} can also be an array with directories.
  if (isArray(dir)) {
    dir.forEach(function(dir) {
      self.scan(dir);
    });
    return this;
  }

  this._wc++;
  readdir(dir, function(err, filenames) {
    if (err) {
      self._emitError(err);
    } else if (filenames.length === 0) {
      self.emit('empty', dir);
    } else {
      filenames.forEach(function(filename) {
        var file = joinPath(dir, filename);
        self._wc++;
        lstat(file, function(err, stat) {
          if (err) {
            self._emitError(err);
          } else {
            self.emit('any', file, stat);
            if (stat.isDirectory()) {
              self.emit('directory', file, stat);
              self.scan(file);
            } else if (self._filter.test(file)) {
              if (stat.isFile()) self.emit('file', file, stat);
              else if (stat.isSymbolicLink()) self.emit('symboliclink', file, stat);
              else if (stat.isBlockDevice()) self.emit('blockdevice', file, stat);
              else if (stat.isCharacterDevice()) self.emit('characterdevice', file, stat);
              else if (stat.isFIFO()) self.emit('fifo', file, stat);
              else if (stat.isSocket()) self.emit('socket', file, stat);
            }
          }
          self._decreaseWaitCount();
        });
      });
    }
    self._decreaseWaitCount();
  });

  return this;
};

exports = module.exports = RecDirReader;