// Node.js
const exec   = require("child_process").exec;
const spawn  = require("child_process").spawn;
const http   = require("https");
const fs     = require("fs-extra");
const Path   = require("path");
const gulp   = require("gulp");
const gulpClean = require("gulp-clean");


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

// Clean all the content in the dist directory
function clean() 
{
    return gulp.src(_outputDir, {read: false, allowEmpty:true})
    .pipe(gulpClean());

    //runCmd("rm -rf " + _outputDir + "/*" ,cb);
};

// Copy the non script assets to the destination folder
function copyAssets(cb)
{
    gulp.src(_inputDir + "/css/**/*").pipe(gulp.dest(_outputDir + "/css"));
    gulp.src(_inputDir + "/lib/**/*").pipe(gulp.dest(_outputDir + "/lib"));
    gulp.src(_inputDir + "/html/**/*").pipe(gulp.dest(_outputDir + "/html"));
    gulp.src(_inputDir + "/img/**/*").pipe(gulp.dest(_outputDir + "/img"));
    gulp.src(_inputDir + "/fonts/**/*").pipe(gulp.dest(_outputDir + "/fonts"));
    gulp.src(_inputDir + "/js/**/*").pipe(gulp.dest(_outputDir + "/js"));

    cb();
};

///////////////////////
// DEVELOPMENT BUILD //
///////////////////////
function run(cb)
{
    runCmd("electron .",cb);
}

// Compile the proyect into to files using webpack
function webpackDevelop(cb)
{
    runCmd("webpack --config "+_webpackConfigDevelop,cb);
};

// Build the project in develop mode
let buildDevelop = gulp.series(clean,copyAssets,webpackDevelop);

// Compile and run the project in develop mode
exports.dev = gulp.series(buildDevelop, run);

//////////////////////
// PRODUCTION BUILD //
//////////////////////

// Compile the proyect into to files using webpack
function webpackProduction(cb)
{
    runCmd("webpack --config "+_webpackConfigProduction,cb);
};

// Build the project with post proccesses
let buildProduction = gulp.series(clean,copyAssets,webpackProduction);

// Compile and run the project in production mode
exports.prod = gulp.series(buildProduction, run);

//////////////
// Publish  //
//////////////

function publishPostProcess(cb)
{
    gulp.src("package.json").pipe(gulp.dest(_outputDir)).on("end",()=>
    {
        let packagePath = Path.join(".",_outputDir,"package.json");
        let json = fs.readJSONSync(packagePath);
    
        json.main = "main.js";
    
        fs.writeJSONSync(packagePath,json);
    
        cb();
    });
}

function packageWin32(cb)
{
    runCmd("electron-packager ./dist --overwrite --asar --platform=win32 --prune=true --out=publish --icon=src/img/tray.ico",cb);
};

// Publish the project 
exports.publishWin32 = gulp.series(buildProduction, publishPostProcess, packageWin32);

/////////////////
// OTHER TASKS //
/////////////////

exports.css = gulp.series(copyAssets,run);
exports.clean = clean;
///////////////////////
// Utility Functions //
///////////////////////

// Run function to run a command and write the output live.
function runCmd(command, callback)
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