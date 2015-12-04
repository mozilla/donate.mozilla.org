var server = require('../../server');
var should = require('should');

var types = {
  css: 'text/css; charset=utf-8',
  html: 'text/html; charset=utf-8',
  ico: 'image/x-icon',
  js: 'application/javascript; charset=utf-8',
  json: 'application/json; charset=utf-8',
  png: 'image/png',
  svg: 'image/svg+xml'
};

var cache = {
  short: 'max-age=300, must-revalidate, public',
  long: 'max-age=604800, must-revalidate, public'
};

describe('static files', () => {
  var files = {
    '/': {
      type: types.html,
      cache: cache.short
    },
    '/api/polyfill.js': {
      type: types.js,
      cache: cache.long,
      vary: 'User-Agent'
    },
    '/assets/images/EOY_facebook_v1.a152496406bad899d1a920f6d6b9f507.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/favicon.8af3a74ede48e250ceb935c026242483.ico': {
      type: types.ico,
      cache: cache.long
    },
    '/assets/images/heart.ce7d2d59c757e1598e244e546426577c.svg': {
      type: types.svg,
      cache: cache.long
    },
    '/assets/images/heart.d0a32f33d389050e90d4b50423a772b5.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/internet-graphic.e9a5980f4251c71bdd72d088f80d9864.svg': {
      type: types.svg,
      cache: cache.long
    },
    '/assets/images/mozilla.5e83dba715a0469b92071758876f0373.svg': {
      type: types.svg,
      cache: cache.long
    },
    '/assets/images/payment_logos_updated.4ca531c0b90d3635aef0c1fc78d5967e.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/paypal_logo@2x.603485f928e450e7098eb55bc982e19a.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/TRHU-funnel-EN.817aaec5d50c7025d65ac4255bdab876.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/js/jquery.min.js': {
      type: types.js,
      cache: cache.long
    },
    '/assets/js/placeholder.min.js': {
      type: types.js,
      cache: cache.long
    },
    '/en-US/': {
      type: types.html,
      cache: cache.short
    },
    '/en-US/about/': {
      type: types.html,
      cache: cache.short
    },
    '/en-US/give-bitcoin/': {
      type: types.html,
      cache: cache.short
    },
    '/en-US/paypal-donate/': {
      type: types.html,
      cache: cache.short
    },
    '/en-US/sequential/': {
      type: types.html,
      cache: cache.short
    },
    '/en-US/share/': {
      type: types.html,
      cache: cache.short
    },
    '/en-US/thank-you/': {
      type: types.html,
      cache: cache.short
    },
    '/exchange-rates/rates-backup.json': {
      type: types.json,
      cache: cache.short
    },
    '/exchange-rates/latest.json': {
      type: types.json,
      cache: cache.short
    },
    '/favicon.ico': {
      type: types.ico,
      cache: cache.long
    },
    '/main.asdf.js': {
      type: types.js,
      cache: cache.long
    },
    '/style.asdf.css': {
      type: types.css,
      cache: cache.long
    }
  };

  var instance = server({ useDomains: false });

  Object.keys(files).forEach((key) => {
    it(`should return okay when accessing ${key}`, (done) => {
      instance.inject({
        url: key
      }, (response) => {
        should(response.statusCode).equal(200);
        should(response.headers['content-type']).equal(files[key].type);
        should(response.headers['cache-control']).equal(files[key].cache);
        should(response.headers.vary).equal(files[key].vary);
        done();
      });
    });
  });
});
