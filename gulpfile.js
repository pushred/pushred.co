const browserSync = require('browser-sync').create();
const cleanUrls = require('clean-urls');
const fs = require('fs');
const gulp = require('gulp');
const gutil = require('gulp-util');
const handlebars = require('gulp-hb');
const Path = require('path');
const rename = require('gulp-rename');
const run = require('run-sequence');
const watch = require('gulp-watch');
const yamlToJSON = require('gulp-yaml');

const markdown = require('./tasks/markdown');

function handleError (err) {
  gutil.log(err.toString());
  this.emit('end');
}

try {
  var contentConfig = fs.readFileSync('./config/content.json', 'utf8');
} catch (err) {
  if (!gutil.env.content) {
    gutil.log(gutil.colors.red('Please specify where content can be found with'), gutil.colors.gray('--content <path>'))
    return;
  }
}

const CONTENT = Path.resolve(gutil.env.content || JSON.parse(contentConfig).path);
gutil.log('Using content from', gutil.colors.magenta(CONTENT));

gulp.task('build', ['buildPages']);

//////////////////
// static site //
////////////////

gulp.task('getContent', () => {
  return gulp
    .src(CONTENT + '/**/*.yml')
    .pipe(yamlToJSON())
    .pipe(markdown())
    .pipe(gulp.dest('.build'));
});

gulp.task('buildPages', ['getContent'], () => {
  return gulp
    .src('server/index.hbs')
    .pipe(handlebars({
      bustCache: true,
      debug: 0,
      data: '.build/*.json',
      helpers: './helpers/*.js',
      partials: ['./server/*.hbs', '!server/layout.hbs']
    }))
    .pipe(rename(function (path) {
      var dirname = path.dirname.split('/').pop();
      if (path.basename === dirname) path.basename = 'index';
      path.extname = '.html';
      return path;
    }))
    .pipe(gulp.dest('.build'));
});

/////////////////////
// preview server //
///////////////////

gulp.task('default', ['build'], () => {
  var openPreference = (gutil.env.open)
    ? eval(gutil.env.open)
    : true;

  browserSync.init({
    server: {
      baseDir: '.build',
      index: 'index.html',
      middleware: cleanUrls(['**/*'], { root: '.build' })
    },
    notify: false,
    open: openPreference
  });

  watch(['server/**/*.hbs', CONTENT + '/**/*.{md,yml}'], () => {
    run('buildPages', browserSync.reload);
  });
});
