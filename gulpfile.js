const fs = require('fs')
const gulp = require('gulp')
const changed = require('gulp-changed')
const license = require('gulp-header-license')

const files = [
  './webpack*.js',
  './server*.js',
  './src/**/*.js',
  './src/**/*.less',
  './src/**/*.scss',
  './config/**/*.js',
  './api/**/*.js'
]

const year = (new Date()).getFullYear()

gulp.task('license', () => {
  return gulp.src(files, { base: './' })
    .pipe(changed('./**/*'))
    .pipe(license(fs.readFileSync('LICENSE-HEADER', 'utf8'), { year }))
    .pipe(gulp.dest(function (file) {
      return file.base
    }))
})
