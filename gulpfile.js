const exec   = require("child_process").exec;
const spawn  = require("child_process").spawn;
const http   = require("https");
const fs     = require("fs");
const gulp   = require("gulp");
const async  = require("async");

const uglify = require("gulp-uglify");

// Constants
const _outputDir = "dist";
const _outputTestDir = "test/build/test";

const _inputDir  = "src";
const _inputTestDir  = "test";

const _appPath   = _outputDir + "/main.js";
const _webpackConfig  = "webpack.config.js";

///////////////////////////////////////////////////////
// Primary Build

// Clean all the content in the build directory
gulp.task("clean", function (cb) 
{
    run("rm -rf " + _outputDir + "/*" ,cb);
});

// Download some files and update them.
gulp.task("download-assets",["clean"],function(cb)
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
gulp.task("copy-assets",["clean"],function(cb)
{
    gulp.src(_inputDir + "/css/**/*").pipe(gulp.dest(_outputDir + "/css"));
    gulp.src(_inputDir + "/lib/**/*").pipe(gulp.dest(_outputDir + "/lib"));
    gulp.src(_inputDir + "/html/**/*").pipe(gulp.dest(_outputDir + "/html"));
    gulp.src(_inputDir + "/img/**/*").pipe(gulp.dest(_outputDir + "/img"));

    cb();
});

// this function is to copy the debug or release env file to have compilation variables
gulp.task("generate-env",["clean"],function(cb)
{
    fs.createReadStream("env.debug").pipe(fs.createWriteStream(_inputDir+"/env.ts")).on("finish", cb);
});


// Compile all the Typescript code using the tsconfig.json
gulp.task("build",["clean","copy-assets","generate-env"],function(cb)
{
    run("webpack --config "+_webpackConfig,cb);
});

// Build the project without post proccesses
gulp.task("build:develop",["build"]);

// Build the project with post proccesses
gulp.task("build:release",["build","minimize"]);

// Compile and run the projectc
gulp.task("dev",["build:develop"],function(cb)
{
    run("electron .",cb);
});

// Just run the project
gulp.task("run",function(cb)
{
    run("electron .",cb);
});


// Minimize the output files
gulp.task("minimize",["build"], function(cb)
{
  return gulp.src(_outputDir + "/**/*.js")
    .pipe(uglify())
    .pipe(gulp.dest(_outputDir));
});

// Default task make the whole build
gulp.task("default", ["dev"]); 

///////////////////////////////////////////////////////
// Test Build

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


///////////////////////////////////////////////////////
// Utility Functions

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

function downloadFile(url,target, callback)
{
    var file = fs.createWriteStream(target);
    var request = http.get(url, function(response) 
    {
        response.pipe(file).on("finish", callback);
    });
}