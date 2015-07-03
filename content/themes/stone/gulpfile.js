var gulp = require('gulp');
var gulpLoadPlugins = require("gulp-load-plugins");
var plugins = gulpLoadPlugins();


gulp.task('bundlejs', function() {
  // return new queue({ objectMode: true })
    // .queue(bowerScripts())
    // .queue(appScripts())
    // .done()
    // .pipe(plugins.if(isProduction, plugins.uglify()))
    // .pipe(plugins.if(isProduction, plugins.concat(paths.appScriptProd)))
    // .pipe(gulp.dest(paths.buildDir));
    
    
    return gulp.src('./lib/*.js')
    .pipe(plugins.uglify())
    .pipe(plugins.concat('lib_built.js'))
    //.pipe(gulp.dest('./dist/'));
    .pipe(gulp.dest('./lib/'));
});