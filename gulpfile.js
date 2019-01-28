const gulp = require('gulp')
const copy = require('gulp-copy')
const ts = require('gulp-typescript')

const tsProject = ts.createProject('tsconfig.json')

function typescript()
{
    const result = tsProject.src().pipe(tsProject())

    return result.js.pipe(gulp.dest('dist'))
}

function copyConfiguration()
{
    return gulp
            .src('./src/**/*.json')
            .pipe(copy('dist', { prefix: 1 }))
}

exports.default = gulp.series(typescript, copyConfiguration)