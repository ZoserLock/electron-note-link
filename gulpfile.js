// Node.js
const exec   = require("child_process").exec;
const spawn  = require("child_process").spawn;
const http   = require("https");
const fs     = require("fs-extra");
const Path   = require("path");
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

// Build the project with post proccesses
gulp.task("build:production",function(cb)
{
    runSequence(
    'clean',                // Clean the output directory
    'copy-assets',          // Copy assets (html/css/images)
    'webpack:production',   // Build ts in production mode
    cb);
});

// Run Webpack using the production configuration
gulp.task("webpack:production",function(cb)
{
    run("webpack --config "+_webpackConfigProduction,cb);
});

// Compile and run the project in production mode
gulp.task("prod",["build:production"],function(cb)
{
    run("electron .",cb);
});

//////////////
// Publish  //
//////////////


gulp.task("generate-publish-package-json",function(cb)
{
    gulp.src("package.json").pipe(gulp.dest(_outputDir)).on("end",()=>
    {
        let packagePath = Path.join(".",_outputDir,"package.json");
        let json = fs.readJSONSync(packagePath);
    
        json.main = "main.js";
    
        fs.writeJSONSync(packagePath,json);
    
        cb();
    });
});

gulp.task("package:win32",function(cb)
{
    run("electron-packager ./dist --overwrite --asar --platform=win32 --prune=true --out=publish",cb);
});

// Publish the proyect 
gulp.task("publish:win32",function(cb)
{
    runSequence(
        "build:production",
        "generate-publish-package-json",
        "package:win32",
        cb);
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