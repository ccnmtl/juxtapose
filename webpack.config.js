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
    resolve: {
        extensions: ['.js', '.jsx']
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
        rules: [
            {
                oneOf: [
                    {
                        test: /\.(js|jsx)$/,
                        include: APP_DIR,
                        loader: require.resolve('babel-loader'),
                        query: {
                            presets: ['@babel/env', '@babel/react']
                        }
                    }
                ]
            }
        ]
    }
};

module.exports = config;
