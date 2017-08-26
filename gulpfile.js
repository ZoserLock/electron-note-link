const exec   = require('child_process').exec;
const http   = require('https');
const fs     = require('fs');
const gulp   = require('gulp');
const async  = require("async");

const uglify = require('gulp-uglify');

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

// Download some files and update them.
gulp.task('download-assets',['clean'],function(cb)
{
    async.parallel(
    [
        function(callback){downloadFile('https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css',_inputDit + '/lib/css/boostrap.min.css',callback)},
        function(callback){downloadFile('https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js'  ,_inputDit + '/lib/js/bootstrap.min.js',callback)},
        function(callback){downloadFile('https://npmcdn.com/tether@1.2.4/dist/js/tether.min.js'                     ,_inputDit + '/lib/js/tether.min.js',callback)},
        function(callback){downloadFile('https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js' ,_inputDit + '/lib/js/popper.min.js',callback)},
        function(callback){downloadFile('https://code.jquery.com/jquery-3.2.1.min.js'                               ,_inputDit + '/lib/js/jquery-3.2.1.min.js',callback)},
    ], 
    function(err, results) 
    {
        cb(err);
    });
});

// Copy the non script assets to the destination folder
gulp.task('copy-assets',['clean','download-assets'],function(cb)
{
    gulp.src(_inputDit + '/css/**/*').pipe(gulp.dest(_outputDir + '/css'));
    gulp.src(_inputDit + '/lib/**/*').pipe(gulp.dest(_outputDir + '/lib'));
    gulp.src(_inputDit + '/html/**/*').pipe(gulp.dest(_outputDir + '/html'));
    gulp.src(_inputDit + '/img/**/*').pipe(gulp.dest(_outputDir + '/img'));

    cb();
});

// this function is to copy the debug or release env file to have compilation variables
gulp.task('generate-env',['clean'],function(cb)
{
    fs.createReadStream('env.debug').pipe(fs.createWriteStream(_inputDit+'/env.ts')).on('finish', cb);
});


// Compile all the Typescript code using the tsconfig.json
gulp.task('build',['clean','copy-assets','download-assets','generate-env'],function(cb)
{
    run('webpack --config '+_webpackConfig,cb);
});

// Build the project without post proccesses
gulp.task('build:develop',['build']);

// Build the project with post proccesses
gulp.task('build:release',['build','minimize']);

// Compile and run the projectc
gulp.task('dev',['build:develop'],function(cb)
{
    run('electron ./dist/main.js',cb);
});

// Just run the project
gulp.task('run',function(cb)
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

// Default task make the whole build
gulp.task("default", ['dev']); 

// Run function to run a command and write the output live.
function run(command, callback)
{
    let process = exec(command, function (err, stdout, stderr) 
    {
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

function downloadFile(url,target, callback)
{
    var file = fs.createWriteStream(target);
    var request = http.get(url, function(response) 
    {
        response.pipe(file).on('finish', callback);
    });
}