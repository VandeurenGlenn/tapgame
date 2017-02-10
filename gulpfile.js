'use strict';
const {task, series, src, dest} = require('gulp');
const injectTemplate = require('gulp-inject-html-template');
const del = require('del');
const {rollup} = require('rollup');
const babel = require('rollup-plugin-babel');
const json = require('rollup-plugin-json');
const browserSync = require('browser-sync').create();
const reload = () => {
  return browserSync.reload;
};
let cache;

task('clean', () => {
  return del(['.elements', 'build']);
})

task('browserSync', () => {
	browserSync.init({
    port: 5000,
    ui: {
      port: 5001
    },
    server: {
      baseDir: ['build', 'bower_components'],
      index: 'index.html'
    }
  });
  browserSync.watch('src/**/*.html')
    .on('change', series('html', 'rollup', 'copy', reload()));
  browserSync.watch('src/**/*.js')
    .on('change', series('html', 'rollup', 'copy', reload()));
    // TODO: Create PouchDB for images...
	// browserSync.watch('src/**/*.{jpg,png}')
  //   .on('change', series('images', reload()));
});

// Copy elements to temporary directory
task('html:inject', () => {
  return src(['src/**/*.{js,html}', '!src/index.html']).pipe(injectTemplate()).pipe(dest('.elements'));
});

// Inject templates before running rollup
task('html', series('html:inject'));

// TODO: rollup every page by itself, create shards like system
task('rollup:run', () => {
  return rollup({
    entry: '.elements/index.js',
    // Use the previous bundle as starting point.
    cache: cache
  }).then(bundle => {
    // Cache our bundle for later use (optional)
    cache = bundle;

    bundle.write({
      format: 'iife',
      moduleName: 'TapGame',
      plugins: [
        babel(),
        json()
      ],
      dest: 'build/index.js'
    });
  });
});

task('rollup:json', () => {
  return src(['src/**/*.json']).pipe(dest('.elements'));
});

task('rollup', series('rollup:json', 'rollup:run'));

task('copy:app', () => {
  return src(['src/index.html']
  ).pipe(dest('build'));
});

task('copy:components', () => {
  return src([
    'bower_components/**/{firebase-app,firebase-auth,firebase-database,custom-elements.min,shadycss.min,shadydom.min}.js']
  ).pipe(dest('build/bower_components'));
});

task('copy:workers', () => {
  return src(['src/workers/*.js']
  ).pipe(dest('build/workers'));
});

task('copy:images', () => {
  return src(['src/sources/**/*.png']
).pipe(dest('build/sources'));
});

task('copy', series('copy:app', 'copy:components', 'copy:workers', 'copy:images'));

task('build', series('clean', 'html', 'rollup', 'copy'));

task('serve', series('build', 'browserSync'));
