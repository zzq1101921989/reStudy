const path = require('path')
const nodeExternals = require('webpack-node-externals')

/** @type {import('webpack').Configuration} */
module.exports = {
  target: 'node',
  mode: 'development',
  entry: path.join(__dirname, './server.js'),
  output: {
    path: path.join(__dirname, './build'),
    filename: 'server.js'
  },
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
  externals: [nodeExternals()]
}