const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: path.resolve(process.cwd(), './src/index.tsx'),
    output: {
        path: path.resolve(process.cwd(), './dist'),
        filename: "app.js"
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: 'ts-loader'
            }
        ]
    },
    mode: "development",
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(process.cwd(), './src/index.html')
        })
    ]
};