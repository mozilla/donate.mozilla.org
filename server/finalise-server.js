var Path = require('path');

module.exports = function finalizeServer(err, server, reactRouted) {
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
