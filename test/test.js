var RecDirReader = require('..');
var assert = require('assert');
var mkdirp = require('mkdirp');
var fs = require('fs');

var testDirectories = [
  './tmp/dir1',
  './tmp/dir1/dir1',
  './tmp/dir1/dir2',
  './tmp/dir2',
  './tmp/dir2/dir1',
  './tmp/dir2/dir2',
  './tmp/empty1',
  './tmp/empty1/empty1',
  './tmp/empty1/empty2',
];
testDirectories.forEach(function(dir) {
  mkdirp.sync(dir);
});

var testFiles = [
  './tmp/dir1/text-1.txt',
  './tmp/dir1/text-1.csv',
  './tmp/dir1/dir1/text-1.txt',
  './tmp/dir1/dir1/text-1.csv',
  './tmp/dir1/dir2/text-1.txt',
  './tmp/dir1/dir2/text-1.csv',
  './tmp/dir2/text-1.txt',
  './tmp/dir2/text-2.txt',
  './tmp/dir2/dir1/text-1.txt',
  './tmp/dir2/dir2/text-1.txt',
];
testFiles.forEach(function(file) {
  fs.writeFileSync(file, '');
});


describe('RecDirReader', function() {

  describe('Without filters', function() {

    it('should find 9 directories and 10 files', function(done) {
      var foundFiles = [];
      var foundDirectories = [];
      RecDirReader().on('file', function(file) {
        foundFiles.push(file);
      }).on('directory', function(dir) {
        foundDirectories.push(dir);
      }).on('end', function() {
        assert.equal(9, foundDirectories.length);
        assert.equal(10, foundFiles.length);
        done();
      }).scan('./tmp');
    });

    it('should find 19 files/directories', function(done) {
      var foundFiles = [];
      RecDirReader().on('any', function(file) {
        foundFiles.push(file);
      }).on('end', function() {
        assert.equal(19, foundFiles.length);
        done();
      }).scan('./tmp');
    });

    it('should find 2 empty directories', function(done) {
      var foundDirectories = [];
      RecDirReader('./tmp').on('empty', function(dir) {
        foundDirectories.push(dir);
      }).on('end', function() {
        assert.equal(2, foundDirectories.length);
        done();
      }).scan();
    });

  });

  describe('Using filters', function() {

    it('should find 3 csv files', function(done) {
      var foundFiles = [];
      RecDirReader('./tmp', /\.csv$/).on('file', function(file) {
        foundFiles.push(file);
      }).on('end', function() {
        assert.equal(3, foundFiles.length);
        done();
      }).scan();
    });

    it('should find 3 csv files', function(done) {
      var foundFiles = [];
      RecDirReader().dir('./tmp').filter(/\.csv$/).on('file', function(file) {
        foundFiles.push(file);
      }).on('end', function() {
        assert.equal(3, foundFiles.length);
        done();
      }).scan();
    });

    it('should find 7 txt files', function(done) {
      var foundFiles = [];
      RecDirReader('./tmp', /\.txt$/).on('file', function(file) {
        foundFiles.push(file);
      }).on('end', function() {
        assert.equal(7, foundFiles.length);
        done();
      }).scan();
    });

    it('should find 7 txt files', function(done) {
      var foundFiles = [];
      RecDirReader().filter(/\.txt$/).on('file', function(file) {
        foundFiles.push(file);
      }).on('end', function() {
        assert.equal(7, foundFiles.length);
        done();
      }).scan('./tmp');
    });

  });

});
