var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, 'src');

var config = {
    entry: ['babel-polyfill', APP_DIR + '/index.jsx'],
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                // Turn 'production' env on when running `make build`
                // 'NODE_ENV': JSON.stringify('production')
            }
        })
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: APP_DIR,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    }
};

module.exports = config;
