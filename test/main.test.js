var assert = require('assert');
var gulp = require('gulp');
var resolve = require('path').resolve;
var fs = require('fs');
var rev = require('../index.js');
var del = require('del');

function countMatches(re, input) {
  var cnt = 0;  
  while (re.exec(input)) {
    cnt++;
  }
  re.lastIndex = 0;
  return cnt;
}

describe('gulp-rev-qs', function () {

  var dest = 'test/fixtures/build';
  var page;

  before(function (callback) {
    gulp.src('test/fixtures/page.html')
      .pipe(rev())
      .pipe(gulp.dest(dest))
      .on('end', function () {
        page = fs.readFileSync(resolve(dest, 'page.html'), 'utf8');
        callback();
      })
      .on('error', callback);
  });

  after(function () {
    del.sync(dest);
  });

  it('update all assets with revision query', function () {
    var re = /\?rev=[0-9]{6,}/g;
    assert(8 === countMatches(re, page));
  });

  it('skip assets with no revision query', function () {
    var re = /\/norev\.css"/g;
    assert(1 === countMatches(re, page));
  });

  it('missed assets revision is set to 0', function () {
    var re = /\/missed\.css\?rev=0"/g;
    assert(1 === countMatches(re, page));
  });

});