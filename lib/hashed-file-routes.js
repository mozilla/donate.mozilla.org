var Path = require('path');

module.exports = function(securityConfig) {
  var fileHashes = require('../public/webpack-assets.json');

  fileHashes.main.js = Path.join(__dirname, '../public', fileHashes.main.js);
  fileHashes.main.css = Path.join(__dirname, '../public', fileHashes.main.css);

  var cache = {
    expiresIn: 7 * 24 * 60 * 60 * 1000, // one week
    privacy: 'public'
  };

  return [
    {
      method: 'GET',
      path: '/main.js',
      handler: {
        file: fileHashes.main.js
      },
      config: {
        cache,
        security: securityConfig
      }
    }, {
      method: 'GET',
      path: '/style.css',
      handler: {
        file: fileHashes.main.css
      },
      config: {
        cache,
        security: securityConfig
      }
    }, {
      method: 'GET',
      path: '/main.{id}.js',
      handler: {
        file: fileHashes.main.js
      },
      config: {
        cache,
        security: securityConfig
      }
    }, {
      method: 'GET',
      path: '/style.{id}.css',
      handler: {
        file: fileHashes.main.css
      },
      config: {
        cache,
        security: securityConfig
      }
    }
  ];
};
