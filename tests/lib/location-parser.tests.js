var locales = {};
Object.keys(require('../../public/locales.json')).forEach(function(locale) {
  locales[locale.toLowerCase()] = locale;
});

var locationParser = require('../../src/lib/location-parser.js')({
  'en-US': {
    nativeName: "English (US)",
    englishName: "English (US)"
  },
  'de': {
    nativeName: "Deutsch",
    englishName: "German"
  },
  'fa-KE': {
    nativeName: "Fake locale",
    englishName: "Fake locale"
  }
}, locales);
var should = require('should');

var tests = [
  {
    desc: 'should redirect to nothing for the location /en-US/',
    test: {
      acceptLang: 'en-US,en;q=0.8',
      location: '/en-US/'
    },
    result: {
      locale: 'en-US',
      redirect: ''
    }
  },
  {
    desc: 'should redirect to nothing for the location /de/',
    test: {
      acceptLang: 'en-US,en;q=0.8',
      location: '/de/'
    },
    result: {
      locale: 'de',
      redirect: ''
    }
  },
  {
    desc: 'should redirect to nothing for the pathname /de/thank-you/',
    test: {
      acceptLang: 'en-US,en;q=0.8',
      location: '/de/thank-you/'
    },
    result: {
      locale: 'de',
      redirect: ''
    }
  }, {
    desc: 'should redirect to de and /thank-you/',
    test: {
      acceptLang: 'de,en;q=0.8',
      location: '/thank-you/'
    },
    result: {
      locale: 'de',
      redirect: '/thank-you/'
    }
  }, {
    desc: 'should redirect to "/thank-you/" if not locale in location',
    test: {
      acceptLang: 'en-US,en;q=0.8',
      location: '/thank-you/'
    },
    result: {
      locale: 'en-US',
      redirect: '/thank-you/'
    }
  }, {
    desc: 'valid locale, but we don\' currently support it.',
    test: {
      acceptLang: 'en-US,en;q=0.8',
      location: '/fa-KE/thank-you/'
    },
    result: {
      locale: 'en-US',
      redirect: '/thank-you/'
    }
  }
];

describe('location-parser.js', function() {
  tests.forEach((item) => {
    it(item.desc, function() {
      should.deepEqual(locationParser(item.test.acceptLang, item.test.location), item.result);
    });
  });
});
