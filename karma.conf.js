var path = require('path');
require('babel-core/register');

function karmaConfig(config) {
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
      externals: {
        'jsdom': 'window',
        'cheerio': 'window',
        'react/lib/ExecutionEnvironment': true,
        'react/addons': true,
        'react/lib/ReactContext': 'window'
      },
      module: {
        loaders: [
          { test: /\.json$/, loaders: ['json-loader'], exclude: ['node_modules'] },
          { test: /\.js$/, loaders:  ['babel-loader'], exclude: ['node_modules'] },
          { test: /\.jsx$/, loaders: ['babel-loader'], exclude: ['node_modules'] }
        ],
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
}

module.exports = karmaConfig;
