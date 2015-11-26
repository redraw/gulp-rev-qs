var assert = require('assert');
var gulp = require('gulp');
var resolve = require('path').resolve;
var fs = require('fs');
var rev = require('../index.js');
var del = require('del');

describe('gulp-rev-qs', function () {

  var dest = 'test/fixtures/build';
  var page;

  var countMatches = function (re) {
    var cnt = 0;
    while (re.exec(page)) {
      cnt++;
    }
    re.lastIndex = 0;
    return cnt;
  }

  before(function (callback) {
    gulp.src('test/fixtures/page.html')
      .pipe(rev({
        resolver: function (path) {
          path = path.replace('{{STATIC_URL}}', '/');
          return path;
        }
      }))
      .pipe(gulp.dest(dest))
      .on('end', function () {
        page = fs.readFileSync(resolve(dest, 'page.html'), 'utf-8');
        callback();
      })
      .on('error', callback);
  });

  after(function () {
    del.sync(dest);
  });

  it('update all assets with revision query', function () {
    assert.equal(10, countMatches(/\?rev=[0-9]{6,}/g));
  });

  it('skip assets with no revision query', function () {
    assert.equal(1, countMatches(/\/norev\.css"/g));
  });

  it('missed assets revision is set to 0', function () {
    assert.equal(1, countMatches(/\/missed\.css\?rev=0/g));
  });

});