var Path = require('path');

var locales = {};
Object.keys(require('../public/locales.json')).forEach(function(locale) {
  locales[locale.toLowerCase()] = locale;
});

var reactRouted = require('../dist/lib/react-server-route.js')(locales);

module.exports = function finalizeServer(err, server) {
  if (err) {
    throw err;
  }

  // We have these routes specifically for production where it's possible that
  // a CDN index.html may refer to an outdated CSS/JS file that doesn't exist
  server.route(require('./lib/hashed-file-routes')());

  var finalRoutes = [{
    method: 'GET',
    path: '/{params*}',
    handler: reactRouted,
    config: {
      cache: {
        expiresIn: 1000 * 60 * 5,
        privacy: 'public'
      }
    }
  }, {
    method: 'GET',
    path: '/assets/{params*}',
    handler: {
      directory: {
        path: Path.join(__dirname, '..', 'assets')
      }
    },
    config: {
      cache: {
        expiresIn: 7 * 24 * 60 * 60 * 1000, // one week
        privacy: 'public'
      }
    }
  }];

  server.route(finalRoutes);
};
