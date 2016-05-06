# watchify-source

```
npm install -D watchify-source
```

```javascript
const gulp = require('gulp');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const watchify = require('watchify-source');
const babelify = require('babelify');
const uglifyify = require('uglifyify');

gulp.task('bundle', () => {
  watchify('./path/to/app/bootstrap.js', {
    babelify,
    [uglifyify, { global: true }],
  })
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(rename('bundle.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public'));
});

gulp.task('bundle-watch', ['bundle'], () => {
  gulp.watch('./path/to/app/**/*.js', ['bundle']);
});
```
