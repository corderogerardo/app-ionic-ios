var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var merge = require('merge-stream');
var watch = require('gulp-watch');

var paths = {
  sass: ['./scss/**/*.scss'],
  js:   ['src/js/**/*.js'],
};

gulp.task('default', ['sass', 'javascript']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('javascript', function(done) {
  var options = {
    destFolder: 'www/js',
    newLine: ';\r\n\r\n',
  };

  var controllers = gulp.src('src/js/controllers/*.js')
    .pipe(concat('controllers.js', {newLine: options.newLine}))
    .pipe(gulp.dest(options.destFolder));

  var directives = gulp.src('src/js/directives/*.js')
    .pipe(concat('directives.js', {newLine: options.newLine}))
    .pipe(gulp.dest(options.destFolder));

  var services = gulp.src('src/js/services/*.js')
    .pipe(concat('services.js', {newLine: options.newLine}))
    .pipe(gulp.dest(options.destFolder));

  var filters = gulp.src('src/js/filters/*.js')
    .pipe(concat('filters.js', {newLine: options.newLine}))
    .pipe(gulp.dest(options.destFolder));

  //We merge streams to
  return merge(controllers, directives, services, filters)
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  //Using gulp watch to trigger on new files
  watch(paths.js, function() {
    gulp.start('javascript');
  });
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
