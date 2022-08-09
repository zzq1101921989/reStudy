const path = require('path');

/** @type {import('webpack').Configuration} */
module.exports = {
    mode: 'development',
    // 输入文件
    entry: path.join(__dirname, `./react${process.env.REACT_Version}/src/index.js`),
    // 输出文件
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: /node_modules/
            }
        ]
    },
}