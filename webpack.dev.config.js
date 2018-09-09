
const path    = require("path");
const webpack = require("webpack");

const TSConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

// Renderer Webpack Configuration
const rendererConfig = 
{
    mode: 'development',
    target: "electron-renderer",
    entry: "./src/renderer.tsx",
    output: 
    {
        path: path.resolve(__dirname, "dist"),
        filename: "renderer.js"
    },
    module: 
    {
        rules: 
        [
            {
                test: /\.tsx?$/,
                include: path.resolve(__dirname, "src"),
                loader: "ts-loader"
            }
        ]
    },
    resolve: 
    {
        extensions: [".js", ".ts", ".tsx", ".json"],
        modules: 
        [
            "node_modules"
        ],
        plugins:
        [
            new TSConfigPathsPlugin({configFile: "./tsconfig.json" }) // This plugin is for use the base path defined in the tsconfig.json
        ]
    },
    plugins: 
    [
      new webpack.DefinePlugin({ "global.GENTLY": false }),
      new webpack.SourceMapDevToolPlugin({ filename: 'renderer.js.map' }),
      new webpack.DefinePlugin({ 
        'process.env': {
            "DEBUG":"true"
        } 
      })
    ],
    node: 
    {
        __dirname: false,
        __filename:false
    },
}

// Main Webpack Configuration
const mainConfig = 
{
    mode: 'development',
    target: "electron-main",
    entry: "./src/main.ts",
    output: 
    {
        path: path.resolve(__dirname, "dist"),
        filename: "main.js"
    },
    module: 
    {
        rules: 
        [
            {
                test: /\.tsx?$/,
                include: path.resolve(__dirname, "src"),
                loader: "ts-loader"
            }
        ]
    },
    resolve: 
    {
        extensions: [".js", ".ts", ".tsx", ".json"],
        modules: 
        [
            "node_modules"
        ],
        plugins:
        [
            new TSConfigPathsPlugin({configFile: "./tsconfig.json" }) // This plugin is for use the base path defined in the tsconfig.json
        ]
    },
    plugins: 
    [
      new webpack.DefinePlugin({ "global.GENTLY": false }),
      new webpack.DefinePlugin({ 
          'process.env': {
              "DEBUG":"true"
          } 
        }),
      new webpack.SourceMapDevToolPlugin({ filename: 'main.js.map' }),
    ],
    node: 
    {
        __dirname: false,
        __filename:false
    },
}

module.exports = 
[
    rendererConfig,
    mainConfig
]