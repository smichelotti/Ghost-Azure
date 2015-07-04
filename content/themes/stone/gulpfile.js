var gulp = require('gulp');
var gulpLoadPlugins = require("gulp-load-plugins");
var plugins = gulpLoadPlugins();

var paths = {
    vendorScripts: ['./lib/shCore.js', './lib/shBrushCSharp.js', './lib/shBrushJSharp.js', './lib/shBrushPowerShell.js', './lib/shBrushSql.js', './lib/shBrushVb.js', './lib/shBrushXml.js']    
};

gulp.task('bundlejs', function() {
  // return new queue({ objectMode: true })
    // .queue(bowerScripts())
    // .queue(appScripts())
    // .done()
    // .pipe(plugins.if(isProduction, plugins.uglify()))
    // .pipe(plugins.if(isProduction, plugins.concat(paths.appScriptProd)))
    // .pipe(gulp.dest(paths.buildDir));
    
    
    //return gulp.src('./lib/*.js')
    return gulp.src(paths.vendorScripts)
    .pipe(plugins.uglify())
    .pipe(plugins.concat('lib_built.js'))
    //.pipe(gulp.dest('./dist/'));
    .pipe(gulp.dest('./lib/'));
});