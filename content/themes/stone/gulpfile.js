var gulp = require('gulp');
var gulpLoadPlugins = require("gulp-load-plugins");
var plugins = gulpLoadPlugins();

var paths = {
    vendorScripts: [
        './assets/js/polyfill.object-fit.min.js',
        './assets/js/uikit.min.js',
        './assets/js/js/jquery.fitvids.js',
        './lib/shCore.js', './lib/shBrushCSharp.js', './lib/shBrushJScript.js', './lib/shBrushPowerShell.js', './lib/shBrushSql.js', './lib/shBrushVb.js', './lib/shBrushXml.js',
        './assets/js/index.js'],
    vendorCss: [
        './assets/css/polyfill.object-fit.css',
        './assets/css/uikit.css',
        './assets/css/monokai_sublime.css',
        './assets/css/stone.css',
        './lib/shThemeDefault.css', 
        './lib/shCore.css']    
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
    //.pipe(plugins.uglify({}))
    .pipe(plugins.concat('lib_built.js'))
    //.pipe(gulp.dest('./dist/'));
    .pipe(gulp.dest('./lib/'));
});

gulp.task('bundlecss', function(){
    return gulp.src(paths.vendorCss)
    .pipe(plugins.minifyCss({}))
    .pipe(plugins.concat('lib_built.css'))
    .pipe(gulp.dest('./assets/css/'));
});