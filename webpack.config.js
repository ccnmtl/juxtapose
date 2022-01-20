const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'build');
const APP_DIR = path.resolve(__dirname, 'src');

module.exports = {
    entry: [APP_DIR + '/index.jsx'],
    mode: process.env.WEBPACK_SERVE ? 'development' : 'production',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.(js|jsx)$/,
                        include: APP_DIR,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env', '@babel/preset-react']
                            }
                        }
                    }
                ]
            }
        ]
    }
};
