var gulp = require('gulp');
var clean = require('gulp-clean');
var ts = require('gulp-typescript');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');

var tsProject = ts.createProject('src/tsconfig.json');

gulp.task('clean', function() {
  return gulp.src(['build'], {read: false})
        .pipe(clean());
});

gulp.task('ts', function () {
    return tsProject.src()
      .pipe(sourcemaps.init())
      .pipe(tsProject())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('build/'));
});

gulp.task('copy-files', function() {
  return gulp.src(['src/manifest.json'])
        .pipe(gulp.dest('build/'));
});

gulp.task('default', function(callback) {
  runSequence(
    'clean',
    ['ts', 'copy-files'],
    callback);
});
