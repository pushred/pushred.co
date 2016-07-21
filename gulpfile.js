const browserSync = require('browser-sync').create();
const browserify = require('browserify');
const cleanUrls = require('clean-urls');
const fs = require('fs');
const gulp = require('gulp');
const gutil = require('gulp-util');
const handlebars = require('gulp-hb');
const lost = require('lost');
const Path = require('path');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const run = require('run-sequence');
const source = require('vinyl-source-stream');
const svgmin = require('gulp-svgmin');
const svgstore = require('gulp-svgstore');
const watch = require('gulp-watch');
const yamlToJSON = require('gulp-yaml');

const markdown = require('./tasks/markdown');
const uploadAssets = require('./tasks/upload_assets');

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

gulp.task('build', ['getContent', 'buildPages', 'bundleCSS', 'bundleJS', 'bundleSVG', 'copyStaticFiles']);

//////////////////
// static site //
////////////////

gulp.task('getContent', () => {
  return gulp
    .src(CONTENT + '/**/*.yml')
    .pipe(yamlToJSON({ json: true }))
    .pipe(markdown())
    .pipe(gulp.dest('.build'));
});

gulp.task('buildPages', () => {
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

gulp.task('copyStaticFiles', () => {
  return gulp
    .src('server/files/**/*')
    .pipe(gulp.dest('.build/files'));
});

/////////////
// assets //
///////////

gulp.task('bundleCSS', () => {
  return gulp
    .src('browser/index.css')
    .pipe(postcss([
      require('postcss-import')({ glob: true }),
      require('postcss-mixins'),
      require('postcss-nested'),
      require('postcss-simple-vars'),
      require('postcss-color-function'),
      require('postcss-calc'),
      require('postcss-custom-media'),
      require('lost'),
      require('autoprefixer')({ browsers: ['last 2 versions', 'ie 9']})
    ]))
    .on('error', handleError)
    .pipe(rename('bundle.css'))
    .pipe(gulp.dest('.build/files'));
});

gulp.task('bundleJS', () => {
  return browserify('browser/index.js')
    .bundle()
    .on('error', handleError)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('.build/files'));
});

gulp.task('bundleSVG', () => {
  return gulp
    .src('server/files/**/*.svg')
    .pipe(svgmin({
      js2svg: {
        pretty: true
      },
      plugins: [{
        convertColors: {
          currentColor: true
        }
      }]
    }))
    .pipe(svgstore())
    .on('error', handleError)
    .pipe(rename('bundle.svg'))
    .pipe(gulp.dest('.build/files'));
});

gulp.task('uploadAssets', () => uploadAssets(CONTENT));

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

  watch(['browser/*.css', 'blocks/*.css'], () => {
    run('bundleCSS', browserSync.reload);
  });

  watch(['browser/*.js', 'blocks/*.js'], () => {
    run('bundleJS', browserSync.reload);
  });

  watch(['server/files/**/*.svg'], () => {
    run('bundleSVG');
  });

  watch(['server/files/**/*.{jpg,png}', CONTENT + '/**/*.{jpg,png,svg}'], () => {
    run('copyStaticFiles');
  });
});
