#gulp-rev-qs [![Build][travis-image]][travis-url]
The [gulp](http://gulpjs.com/) plugin for cache-busting files using query string.

e.g. ```<script src="/js/awesome.js?rev=3457654245"></script>```
##Install
```
npm install quex46/gulp-rev-qs --save
```
##Usage
```
-app/
  |-gulpfile.js
  |-assets/
  |-views/
```
```javascript
// gulpfile.js
var gulp = require('gulp');
var rev = require('gulp-rev-qs');

gulp.task('rev', function () {
  return gulp.src('views/**/*.html') // get all *.html files from ./views/
    .pipe(rev('./assets'))           // populate all "?rev=0" queries with checksums
    .pipe(gulp.dest('rev_views'));   // save populated html-files in ./rev_views/
});
```
```
$ gulp rev
```
## Options (*String*|*Object*)
**options.base** *String* - assets basepath

**options.resolver** *Function* - use this param if you would dinamically resolve asset filepath. See example [here](https://github.com/quex46/gulp-rev-qs/issues/1)

``rev('./assets')`` is identical to ``rev({base: './assets'})``
##Running tests
```
npm test
```
##License
gulp-rev-qs is licensed under the MIT License.

[travis-url]: https://travis-ci.org/quex46/gulp-rev-qs
[travis-image]: https://travis-ci.org/quex46/gulp-rev-qs.svg?branch=master

