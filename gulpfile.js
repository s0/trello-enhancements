var gulp = require('gulp');
var clean = require('gulp-clean');
var ts = require('gulp-typescript');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var zip = require('gulp-zip');

sass.compiler = require('node-sass');

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

gulp.task('sass', function () {
  return gulp.src('src/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/'));
});

gulp.task('copy-files', function() {
  return gulp.src(['src/*.json', 'src/*.css'])
        .pipe(gulp.dest('build/'));
});

gulp.task('copy-libs', function() {
  return gulp.src(['node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('build/'));
});

gulp.task('default', function(callback) {
  runSequence(
    'clean',
    ['ts', 'sass', 'copy-files', 'copy-libs'],
    callback);
});

gulp.task('dist', ['default'], () =>
	gulp.src('build/*')
		.pipe(zip('dist.zip'))
		.pipe(gulp.dest('./'))
);
