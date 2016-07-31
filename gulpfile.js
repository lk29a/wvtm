var gulp = require("gulp");
var del = require("del");
var tsc = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps');
var tsProject = tsc.createProject("tsconfig.json");
var tslint = require('gulp-tslint');

/**
 * Remove build directory.
 */
gulp.task('clean', function(cb) {
  return del(["build"], cb);
});

/**
 * Lint all custom TypeScript files.
 */
gulp.task('tslint', function() {
  return gulp.src("src/**/*.ts")
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});

/**
 * Compile TypeScript sources and create sourcemaps in build directory.
 */
gulp.task("compile", ["tslint"], function() {
  let tsResult = gulp.src("src/**/*.ts")
    .pipe(sourcemaps.init())
    .pipe(tsc(tsProject));
  return tsResult.js
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("build"));
});

/**
 * Copy all resources that are not TypeScript files into build directory.
 */
gulp.task("resources", function() {
  return gulp.src(["src/**/*", "!**/*.ts"])
    .pipe(gulp.dest("build"));
});

/**
 * Copy all required libraries into build directory.
 */
gulp.task("libs", function() {
  return gulp.src([
      'core-js/client/shim.min.js',
      'systemjs/dist/system-polyfills.js',
      'systemjs/dist/system.src.js',
      'reflect-metadata/Reflect.js',
      'rxjs/**',
      'zone.js/dist/**',
      '@angular/**'
    ], { cwd: "node_modules/**" }) /* Glob required here. */
    .pipe(gulp.dest("build/lib"));
});

/**
 * Watch for changes in TypeScript, HTML and CSS files.
 */
gulp.task('watch', function() {
  gulp.watch(["src/**/*.ts"], ['compile']).on('change', function(e) {
    console.log('TypeScript file ' + e.path + ' has been changed. Compiling.');
  });
  gulp.watch(["src/**/*.html", "src/**/*.css"], ['resources']).on('change', function(e) {
    console.log('Resource file ' + e.path + ' has been changed. Updating.');
  });
});

/**
 * Build-dev project only necessary files.
 */
gulp.task("builddev", ['compile', 'resources'], function() {
  console.log("Building source files ...");
});

/**
 * Build project complete.
 */
gulp.task("build", ["compile", "resources", "libs"], function() {
  console.log("Building the project ...");
});
