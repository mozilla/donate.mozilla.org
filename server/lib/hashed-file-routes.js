const FS = require('fs');
const Path = require('path');

function pathify(parent, path) {
  return Path.join(__dirname, '..', '..', parent, path);
}

const hashedFileRoutes = function() {
  const hashedPaths = [];
  const filename = pathify('public', 'webpack-assets.json');
  let fileHashes = JSON.parse(FS.readFileSync(filename));

  FS.watch(filename, { persistent: false, recursive: false }, () => {
    FS.readFile(filename, 'utf8', (read_error, data) => {
      if (!read_error) {
        try {
          fileHashes = JSON.parse(data);
        } catch (ignore_error) {
          // nothing at the moment
        }
      }
    });
  });

  const cache = {
    expiresIn: 7 * 24 * 60 * 60 * 1000, // one week
    privacy: 'public'
  };

  const files = {
    '/images/CVC-illustration.png' : pathify('assets', 'images/CVC-illustration.70d7262b2227d24a2f440cc0d560b7da.png'),
    '/images/EOY_facebook_v1.png' : pathify('assets', 'images/EOY_facebook_v1.a152496406bad899d1a920f6d6b9f507.png'),
    '/images/favicon.png' : pathify('assets', 'images/favicon.d0608f227db61f2852a32087e614911c.png'),
    '/favicon.png' : pathify('assets', 'images/favicon.d0608f227db61f2852a32087e614911c.png'),
    '/images/heart.svg' : pathify('assets', 'images/heart.ce7d2d59c757e1598e244e546426577c.svg'),
    '/images/internet-graphic.svg' : pathify('assets', 'images/internet-graphic.e9a5980f4251c71bdd72d088f80d9864.svg'),
    '/images/mozilla.svg' : pathify('assets', 'images/mozilla.1068965acefde994a71c187d253aca2b.svg'),
    '/images/payment_logos_updated.png' : pathify('assets', 'images/payment_logos_updated.4ca531c0b90d3635aef0c1fc78d5967e.png'),
    '/images/payment_logos_discover.png' : pathify('assets', 'images/payment_logos_discover.e08ebedbd623af15a14094b6821ca137.png'),
    '/images/paypal_logo@2x.png' : pathify('assets', 'images/paypal_logo@2x.603485f928e450e7098eb55bc982e19a.png')
  };

  Object.keys(files).forEach(item => {
    hashedPaths.push({
      method: 'GET',
      path: item,
      handler: {
        file: files[item]
      },
      config: {
        cache
      }
    });
  });

  hashedPaths.push({
    method: 'GET',
    path: '/main.{id}.js',
    handler: function(request, h) {
      return h.file(pathify('public', fileHashes.main.js));
    },
    config: {
      cache
    }
  }, {
    method: 'GET',
    path: '/style.{id}.css',
    handler: function(request, h) {
      return h.file(pathify('public', fileHashes.main.css));
    },
    config: {
      cache
    }
  });
  return hashedPaths;
};

module.exports = hashedFileRoutes;
