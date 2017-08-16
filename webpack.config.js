const path = require('path')

const commonConfig = 
{
    module: 
    {
        rules: 
        [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: ['ts-loader']
            }
        ]
    },
    node: 
    {
        __dirname: false
    },
    resolve: 
    {
        extensions: ['.js', '.ts', '.tsx', '.json'],
        modules: 
        [
            path.join(__dirname, 'app'),
            'node_modules'
        ]
    },
    output: 
    {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    }
}

module.exports = [
    Object.assign(
    {
        target: 'electron-main',
        entry: { main: './src/main.ts' }
    },
    commonConfig),
    Object.assign(
    {
        target: 'electron-renderer',
        entry: { app: './src/app.tsx' },
    },
    commonConfig)
  ]