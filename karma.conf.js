var webpackConfig = require('./webpack.config.js');
var path = require('path');

module.exports = function (config) {
  config.set({
    browsers: ['Firefox'],
    singleRun: true,
    frameworks: ['mocha'],
    files: [
      'tests/react/index.jsx'
    ],
    preprocessors: {
      'tests/react/index.jsx': ['webpack', 'sourcemap']
    },
    reporters: ['mocha'],
    coverageReporter: {
      type: 'lcov',
      dir: 'www/coverage/'
    },
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: webpackConfig.module.loaders,
        postLoaders: process.env.KARMA_ENV === 'coverage' ? [{
          test: /\.js$/,
          loader: 'istanbul-instrumenter',
          include: [path.join(__dirname, '/src')]
        }] : null
      }
    },
    webpackServer: {
      noInfo: true
    }
  });
};
