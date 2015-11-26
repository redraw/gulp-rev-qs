// Inspired by bustardcelly's gulp-rev-append
// https://github.com/bustardcelly/gulp-rev-append

var fs = require('fs');
var path = require('path');
var crc32 = require('buffer-crc32');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var map = require('event-stream').map;

const PLUGIN_NAME = 'gulp-rev-qs';
const R_FIND = /(?:href=|src=|url\()['|"]?([^\s>"']+?)\?rev=([^\s>"')]*)['|"]?/gi;
const PFX = '?rev=';

module.exports = function revPlugin(options) {
  
  if (typeof options === 'string') {
    options = {
      base: options
    };
  } else if (!options) {
    options = {};
  }

  var manifest = {};

  return map(function (file, cb) {
    
    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    var contents = file.contents.toString();
    var depPath;
    var depCRC;

    contents = contents.replace(R_FIND, function (match, assetPath, rev) {
      if (typeof options.resolver === 'function') {
        assetPath = options.resolver(assetPath);
      }
      assetPath = path.normalize(assetPath);
      if (assetPath.indexOf(path.sep) === 0) {
        depPath = path.join(options.base || file.base, assetPath);
      } else {
        depPath = path.resolve(path.dirname(file.path), assetPath);
      }

      try {
        if (!manifest[depPath]) {
          manifest[depPath] = crc32.unsigned(fs.readFileSync(depPath));
        }
        depCRC = manifest[depPath];
      } catch (e) {
        depCRC = manifest[depPath] = '0';
      }

      return match.replace(PFX + rev, PFX + depCRC);
    });

    file.contents = new Buffer(contents);
    R_FIND.lastIndex = 0;

    cb(null, file);
  });
};