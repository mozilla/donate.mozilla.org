var Path = require('path');

function pathify(parent, path) {
  return Path.join(__dirname, '..', parent, path);
}

module.exports = function() {
  var fileHashes = require('../public/webpack-assets.json');

  var cache = {
    expiresIn: 7 * 24 * 60 * 60 * 1000, // one week
    privacy: 'public'
  };

  var files = {
    '/images/CVC-illustration.png' : pathify('assets', 'images/CVC-illustration.70d7262b2227d24a2f440cc0d560b7da.png'),
    '/images/EOY_facebook_v1.png' : pathify('assets', 'images/EOY_facebook_v1.a152496406bad899d1a920f6d6b9f507.png'),
    '/images/favicon.ico' : pathify('assets', 'images/favicon.8af3a74ede48e250ceb935c026242483.ico'),
    '/favicon.ico' : pathify('assets', 'images/favicon.8af3a74ede48e250ceb935c026242483.ico'),
    '/images/heart.svg' : pathify('assets', 'images/heart.ce7d2d59c757e1598e244e546426577c.svg'),
    '/images/internet-graphic.svg' : pathify('assets', 'images/internet-graphic.e9a5980f4251c71bdd72d088f80d9864.svg'),
    '/images/mozilla.svg' : pathify('assets', 'images/mozilla.5e83dba715a0469b92071758876f0373.svg'),
    '/images/payment_logos_updated.png' : pathify('assets', 'images/payment_logos_updated.4ca531c0b90d3635aef0c1fc78d5967e.png'),
    '/images/paypal_logo@2x.png' : pathify('assets', 'images/paypal_logo@2x.603485f928e450e7098eb55bc982e19a.png'),
    '/main.{id}.js': pathify('public', fileHashes.main.js),
    '/style.{id}.css': pathify('public', fileHashes.main.css)
  };

  return Object.keys(files).map(function(item) {
    return {
      method: 'GET',
      path: item,
      handler: {
        file: files[item]
      },
      config: {
        cache
      }
    };
  });
};
