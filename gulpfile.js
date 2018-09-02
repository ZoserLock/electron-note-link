// Node.js
const exec   = require("child_process").exec;
const spawn  = require("child_process").spawn;
const http   = require("https");
const fs     = require("fs");
const gulp   = require("gulp");

const runSequence = require('run-sequence');

// Constants
const _outputDir = "dist";
const _outputTestDir = "test/build/test";

const _inputDir  = "src";
const _inputTestDir  = "test";

const _webpackConfigDevelop     = "webpack.dev.config.js";
const _webpackConfigProduction  = "webpack.prod.config.js";

////////////////////
// UTILITY TASKS  //
////////////////////

// Clean all the content in the build directory
gulp.task("clean", function (cb) 
{
    run("rm -rf " + _outputDir + "/*" ,cb);
});

// Download some files and update them. (currently not being used)
gulp.task("download-assets",function(cb)
{
    async.parallel(
    [
        function(callback){downloadFile("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css",_inputDir + "/lib/css/boostrap.min.css",callback)}
    ], 
    function(err, results) 
    {
        cb(err);
    });
});

// Copy the non script assets to the destination folder
gulp.task("copy-assets",function(cb)
{
    gulp.src(_inputDir + "/css/**/*").pipe(gulp.dest(_outputDir + "/css"));
    gulp.src(_inputDir + "/lib/**/*").pipe(gulp.dest(_outputDir + "/lib"));
    gulp.src(_inputDir + "/html/**/*").pipe(gulp.dest(_outputDir + "/html"));
    gulp.src(_inputDir + "/img/**/*").pipe(gulp.dest(_outputDir + "/img"));
    gulp.src(_inputDir + "/fonts/**/*").pipe(gulp.dest(_outputDir + "/fonts"));

    cb();
});

///////////////////////
// DEVELOPMENT BUILD //
///////////////////////

// Compile and run the project in develop mode
gulp.task("dev",["build:develop"],function(cb)
{
    run("electron .",cb);
});

// Build the project in develop mode
gulp.task("build:develop",function(cb)
{
    runSequence(
    'clean',            // Clean the output directory
    'copy-assets',      // Copy assets (html/css/images)
    'webpack:develop',  // Build ts in develop mode
    cb);
});

// Compile the proyect into to files using webpack
gulp.task("webpack:develop",function(cb)
{
    run("webpack --config "+_webpackConfigDevelop,cb);
});

//////////////////////
// PRODUCTION BUILD //
//////////////////////

// Compile and run the project in production mode
gulp.task("prod",["build:production"],function(cb)
{
    run("electron .",cb);
});

// Build the project with post proccesses
gulp.task("build:production",function(cb)
{
    runSequence(
    'clean',                // Clean the output directory
    'copy-assets',          // Copy assets (html/css/images)
    'webpack:production',   // Build ts in production mode
    cb);
});

gulp.task("webpack:production",function(cb)
{
    run("webpack --config "+_webpackConfigProduction,cb);
});

/////////////////
// OTHER TASKS //
/////////////////

// Refresh Assets
gulp.task("build:refresh",function(cb)
{
    runSequence(
    'copy-assets',
    cb);
});

// Copy just the resources. The proyect is not built
gulp.task("css",["build:refresh"],function(cb)
{
    run("electron .",cb);
});

// Just run the project
gulp.task("run",function(cb)
{
    run("electron .",cb);
});

////////////////
// TEST BUILD //
////////////////

gulp.task("clean:tests", function (cb) 
{
    run("rm -rf " + _outputTestDir + "/*" ,cb);
});

gulp.task("build:tests",["clean:tests"],function(cb)
{
    run("tsc -p tsconfig.tests.json",cb);
});

gulp.task("test",["build:tests"],function(cb)
{
    run("mocha " + _outputTestDir,cb);
});

///////////////////////
// Utility Functions //
///////////////////////

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

    process.stdout.on("data", function(data) 
    {
        console.log(data); 
    });
}

// Download a file from the url and write it into target path.
function downloadFile(url, target, callback)
{
    var file = fs.createWriteStream(target);
    var request = http.get(url, function(response) 
    {
        response.pipe(file).on("finish", callback);
    });
}