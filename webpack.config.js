const path = require("path");
const webpack = require("webpack");
const TSConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const commonConfig = 
{
    mode: 'development',
    module: 
    {
        rules: 
        [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: ["ts-loader"]
            }
        ]
    },
    node: 
    {
        __dirname: false,
        __filename:false
    },
    resolve: 
    {
        extensions: [".js", ".ts", ".tsx", ".json"],
        modules: 
        [
            path.join(__dirname, "app"),
            "node_modules"
        ],
        plugins:
        [
            new TSConfigPathsPlugin({configFile: "./tsconfig.json" }) // This plugin is for use the base path defined in the tsconfig.json
        ]
    },
    output: 
    {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    },
    plugins: 
    [
      new webpack.DefinePlugin({ "global.GENTLY": false }),
      new webpack.SourceMapDevToolPlugin({ filename: '[name].js.map' }),
    ]
}

module.exports = [
    Object.assign(
    {
        target: "electron-main",
        entry: { main: "./src/main.ts" }
    },
    commonConfig),
    Object.assign(
    {
        target: "electron-renderer",
        entry: { app: "./src/app.tsx" },
    },
    commonConfig)
  ]