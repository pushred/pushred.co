var crypto = require('crypto');
var gulp = require('gulp');
var gutil = require('gulp-util');
var hashsum = require('gulp-hashsum');
var fs = require('fs');
var Path = require('path');
var through = require('through2');

var s3config = require('../config/s3.json');

var s3 = require('gulp-s3-upload')({
  accessKeyId: s3config.accessKeyId,
  secretAccessKey: s3config.secretAccessKey
});

function handleError (err) {
  gutil.log(gutil.colors.red(err.toString()));
  this.emit('end');
}

module.exports = (CONTENT) => {

  gutil.log(gutil.colors.cyan('Uploading to S3'));

  ///////////////////////////////////////
  // checksum, only upload what's new //
  /////////////////////////////////////

  try {
    var manifest = {};
    var sha1sums = fs.readFileSync(Path.join(CONTENT, '.uploads.sha1'), 'utf8');

    sha1sums = sha1sums.trim().split(/\n/);

    var pathIndex = sha1sums[0].split(/\s\s/)[0].match(/\./)
      ? 0
      : 1;

    sha1sums.forEach(function (file) {
      file = file.split(/\s\s/);
      manifest[file[pathIndex]] = (pathIndex === 0)
        ? file[1]
        : file[0];
    });
  } catch (err) { } // manifest file may not exist yet

  return gulp
    .src(Path.join(CONTENT, '**', '*.{jpg,png,mp4}'))
    .pipe(hashsum({
      filename: '.uploads.sha1',
      dest: CONTENT
    }))
    .pipe(through.obj(function (file, enc, cb) {

      if (!manifest || file.stat.isDirectory()) {
        this.push(file);
        cb();
        return;
      }

      var filePath = file.path.replace(file.base, '');
      var oldHash = manifest[filePath];

      var newHash = crypto
        .createHash('sha1')
        .update(file.contents, 'binary')
        .digest('hex');

      if (oldHash !== newHash) this.push(file);

      cb();
      return
    }))
    .pipe(s3({
      Bucket: s3config.bucket,
      onChange: function (filename) {
        gutil.log(gutil.colors.gray('Uploaded', filename));
      }
    }))
    .on('error', handleError)
    .on('end', function () {
      gutil.log(gutil.colors.green('✓ Everything is up to date'));
    });
};
