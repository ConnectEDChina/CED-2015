var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var del = require('del');
var shell = require('gulp-shell');

var src_path = {
    scripts_client: [
        'public/javascripts/*.js'
    ],
    scripts_server: [
        'public/routes/*.js'
    ],
    bowerConfig: './bower.json'
};
var dest_path = {
    scripts: 'public/dist'
};

gulp.task('clean', function(cb) {
    del(['public/dist'], cb);
});

gulp.task('lintClient', function() {
    return gulp.src(src_path.scripts_client)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('scripts', ['lintClient', 'clean'], shell.task([
    'r.js -o build.js'
    //'java -classpath ./tools/js.jar:./tools/compiler.jar org.mozilla.javascript.tools.shell.Main r.js -o build.js'
]));

gulp.task('bower', function(cb) {

    var bowerRequirejs = require('bower-requirejs');
    var options = {
        baseUrl: 'public/dist',
        config: 'public/javascripts/config.js',
        transitive: true
    };

    bowerRequirejs(options, function (rjsConfigFromBower) {
        cb();
    });
});

gulp.task('lintServer', function () {
    return gulp.src(src_path.scripts_server)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function() {
    // gulp.watch(src_path.scripts, ['lint', 'uglify']);
    gulp.watch(src_path.scripts_client, ['scripts']);
    gulp.watch('./build.js', ['scripts']);
    gulp.watch(src_path.scripts_server, ['lintServer']);
    gulp.watch(src_path.bowerConfig, ['bower']);
});

gulp.task('dev', ['lintServer', 'bower', 'scripts', 'watch']);
gulp.task('package', ['lintServer', 'bower', 'scripts']);
gulp.task('default', ['package']);
