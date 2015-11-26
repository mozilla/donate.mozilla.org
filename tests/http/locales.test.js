var should = require('should');
var paths = require('../../data/paths.js');
var server = require('../../server');
var instance = server({ useDomains: false });

var type = 'text/html; charset=utf-8';
var cache = 'max-age=300, must-revalidate, public';

describe('paths with locale', () => {
  paths.forEach((page) => {
    it(`${page.pathname}`, (done) => {
      instance.inject({
        url: page.pathname
      }, (response) => {
        should(response.statusCode).equal(200);
        should(response.headers['content-type']).equal(type);
        should(response.headers['cache-control']).equal(cache);
        done();
      });
    });
  });
});

describe('paths with no locale and no trailing slash', () => {
  var urls = {
    '/about': {
      headers: {
        'Accept-Language':"de,en;q=0.5"
      },
      then: {
        '/about/': {
          finalURL: '/de/about/'
        }
      }
    },
    '/abcde': {
      headers: {
        'Accept-Language':"fr,en;q=0.5"
      },
      then: {
        '/abcde/': {
          finalURL: '/fr/'
        }
      }
    },
    '/fr/abcde': {
      headers: {
        'Accept-Language':"fr,en;q=0.5"
      },
      then: {
        '/': {
          finalURL: '/fr/'
        }
      }
    }
  };
  Object.keys(urls).forEach((url, i) => {
    it(`${url}`, (done) => {
      instance.inject({
        url: url,
        headers: urls[url].headers
      }, (response) => {
        should(response.statusCode).equal(302);
        should(response.headers.location).equal(Object.keys(urls[url].then)[0]);
        done();
      });
    });
    it(`${Object.keys(urls[url].then)[0]}`, (done) => {
      instance.inject({
        url: Object.keys(urls[url].then)[0],
        headers: urls[url].headers
      }, (response) => {
        should(response.statusCode).equal(302);
        should(response.headers.location).equal(urls[url].then[Object.keys(urls[url].then)[0]].finalURL);
        done();
      });
    });
  });
});

describe('paths with no trailing slash', () => {
  var noSlashPaths = {
    '/de/about': {
      type,
      cache,
      equal: '/de/about/'
    },
    '/en-US/about': {
      type,
      cache,
      equal: '/en-US/about/'
    }
  };
  Object.keys(noSlashPaths).forEach((page) => {
    it(`${page.pathname}`, (done) => {
      instance.inject({
        url: page
      }, (response) => {
        should(response.statusCode).equal(302);
        should(response.headers.location).equal(noSlashPaths[page].equal);
        done();
      });
    });
  });
});

describe('paths with no locale', () => {
  var noLocalePaths = {
    '/': {
      type,
      cache,
      equal: '/de/',
      headers: {
        'Accept-Language':"de,en;q=0.5"
      }
    },
    '/about/': {
      type,
      cache,
      equal: '/en-US/about/',
      headers: {
        'Accept-Language':"en,en-OO;q=0.5"
      }
    },
    '/wx/': {
      type,
      cache,
      equal: '/en-US/',
      headers: {
        'Accept-Language':"en;q=0.5"
      }
    },
    '/wx/about/': {
      type,
      cache,
      equal: '/fr/about/',
      headers: {
        'Accept-Language':"en,fr,de;q=0.5"
      }
    }
  };

  Object.keys(noLocalePaths).forEach((key) => {
    it(`should redirect to ${noLocalePaths[key].equal} when accessing ${key}`, (done) => {
      instance.inject({
        url: key,
        headers: noLocalePaths[key].headers
      }, (response) => {
        should(response.statusCode).equal(302);
        should(response.headers.vary).equal('Accept-Language');
        should(response.headers.location).equal(noLocalePaths[key].equal);
        done();
      });
    });
  });
});

