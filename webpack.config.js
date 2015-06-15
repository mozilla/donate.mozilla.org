var path = require('path');

module.exports = {
  entry: "./client.jsx",

  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: path.join('public', 'build'),
    publicPath: '/build/'
  },

  module: {
    loaders: [
      { test: /\.jsx$/, loaders: ['jsx-loader'] },
      { test: /\.json$/, loaders: ['json-loader'] }
    ]
  }
};

