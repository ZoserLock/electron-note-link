var exec   = require('child_process').exec;
var gulp   = require('gulp');

var uglify = require('gulp-uglify');

// Constants
const _outputDir = "dist";
const _inputDit  = "src";
const _appPath   = _outputDir + "/main.js";
const _webpackConfig  = "webpack.config.js";

// Clean all the content in the build directory
gulp.task("clean", function (cb) 
{
    run('rm -rf ' + _outputDir + '/*' ,cb);
});

// Copy the non script assets to the destination folder
gulp.task('copy-assets',['clean'],function(cb)
{
     return gulp
    .src(_inputDit + '/html/*')
    .pipe(gulp.dest(_outputDir + '/html'));
});

// Compile all the Typescript code using the tsconfig.json
gulp.task('build',['clean','copy-assets'],function(cb)
{
    run('webpack --config '+_webpackConfig,cb);
});

gulp.task('run',['build'],function(cb)
{
    run('electron ./dist/main.js',cb);
});

// Minimize the output files
gulp.task('minimize',['build'], function(cb)
{
  return gulp.src(_outputDir + '/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(_outputDir));
});

// Build and run the project
gulp.task('publish',['build'], function(cb)
{
    // Run packaging code.
});

// Utility tasks

// Default task make the whole build
gulp.task("default", ['run']); 

// Build the project without post proccesses
gulp.task('build:develop',['build']);

// Build the project with post proccesses
gulp.task('build:release',['build','minimize']);

// Run function to run a command and write the output live.
function run(command, callback)
{
    let process = exec(command, function (err, stdout, stderr) 
    {
        console.log(stdout);
        console.log(stderr); 

        if(callback != undefined)
        {
             callback(err);
        }
    });

    process.stdout.on('data', function(data) 
    {
        console.log(data); 
    });
}