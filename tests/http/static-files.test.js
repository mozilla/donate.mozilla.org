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
    '/api/polyfill.js': {
      type: types.js,
      cache: cache.long,
      vary: 'User-Agent'
    },
    '/assets/images/CVC-illustration.70d7262b2227d24a2f440cc0d560b7da.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/EOY_Twitter_v8_EN.d1bb5d2a5ce35859d038df852d9e6a0a811beaac.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/EOY_facebook_v1.a152496406bad899d1a920f6d6b9f507.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/TRHU-funnel-DE.3772cabe35339b6d73e3360cb4b275cd.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/TRHU-funnel-EN.817aaec5d50c7025d65ac4255bdab876.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/TRHU-funnel-ES.27c2c56cae275f9d58fb421679a05399.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/TRHU-funnel-FR.7a7acdd32ea3d145e3225cc19e39e730.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/TRHU-funnel-IT.aeb11a79ef173e7a5368c568d24ffd34.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/TRHU-funnel-pt-BR.763d3a9aa0b0bc8a6f699f62b52cb572.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/TRHU-snippet-DE.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/TRHU-snippet-EN.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/TRHU-snippet-ES.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/TRHU-snippet-FR.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/TRHU-snippet-IT.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/TRHU-snippet-pt-BR.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/email-ask-v1_EN.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/email-ask-v2_EN.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/email-ask-v3_EN.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/email-ask-v4_EN.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/email-ask-v5_EN.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/images/email-ask-v6_EN.png': {
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
    '/assets/images/mozilla-circular.911f4f7f4e6682c9893b8441d2e09df40cea80e2.png': {
      type: types.png,
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
    '/assets/js/jquery.min.js': {
      type: types.js,
      cache: cache.long
    },
    '/assets/js/placeholder.min.js': {
      type: types.js,
      cache: cache.long
    },
    '/assets/tiles/eoy01.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/tiles/eoy02.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/tiles/eoy03.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/tiles/eoy04.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/tiles/eoy05.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/tiles/eoy06.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/tiles/eoy07.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/tiles/eoy08.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/tiles/eoy09.png': {
      type: types.png,
      cache: cache.long
    },
    '/assets/tiles/eoy10.png': {
      type: types.png,
      cache: cache.long
    },
    '/en-US/': {
      type: types.html,
      cache: cache.short,
      vary: 'User-Agent'
    },
    '/en-US/about/': {
      type: types.html,
      cache: cache.short,
      vary: 'User-Agent'
    },
    '/en-US/give-bitcoin/': {
      type: types.html,
      cache: cache.short,
      vary: 'User-Agent'
    },
    '/en-US/paypal-donate/': {
      type: types.html,
      cache: cache.short,
      vary: 'User-Agent'
    },
    '/en-US/share/': {
      type: types.html,
      cache: cache.short,
      vary: 'User-Agent'
    },
    '/en-US/thank-you/': {
      type: types.html,
      cache: cache.short,
      vary: 'User-Agent'
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

  it(`should redirect and return 302 when accessing '/'`,(done) => {
    instance.inject({
      url: '/'
    }, (response) => {
      should(response.statusCode).equal(302);
      done();
    });
  });

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
