/* eslint-env node */

module.exports = {
    automock: false,
    'setupFiles': [
        '<rootDir>/setupJest.js'
    ],
    'testEnvironment': 'jsdom',
    'transform': {
        '^.+\\.jsx?$': 'babel-jest'
    },
    moduleDirectories: [
        'node_modules'
    ],
    'transformIgnorePatterns': [
        // OpenLayers is distributed with es6 and needs to be
        // transformed with babel.
        //
        // See: https://github.com/openlayers/openlayers/issues/7401
        //
        '/node_modules/(?!ol/)'
    ]
};
