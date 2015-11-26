var should = require('should');
var server = require('../../server');
var instance = server({ useDomains: false });

var type = 'text/html; charset=utf-8';
var cache = 'max-age=300, must-revalidate, public';

describe('make sure redirect still preserve query', () => {
  var noLocalePaths = {
    '/?abc=123': {
      type,
      cache,
      equal: '/de/?abc=123',
      headers: {
        'Accept-Language':"de,en;q=0.5"
      }
    },
    '/about/?abc=123': {
      type,
      cache,
      equal: '/en-US/about/?abc=123',
      headers: {
        'Accept-Language':"en,en-OO;q=0.5"
      }
    },
    '/wx/?abc=123': {
      type,
      cache,
      equal: '/en-US/?abc=123',
      headers: {
        'Accept-Language':"en;q=0.5"
      }
    },
    '/wx/about/?abc=123': {
      type,
      cache,
      equal: '/fr/about/?abc=123',
      headers: {
        'Accept-Language':"en,fr,de;q=0.5"
      }
    },
    '/de/about?abc=123': {
      type,
      cache,
      equal: '/de/about/?abc=123',
      headers: {
        'Accept-Language':"de,en;q=0.5"
      }
    }
  };

  Object.keys(noLocalePaths).forEach((key) => {
    it(`should redirect to ${noLocalePaths[key].equal} when accessing ${key} and preserve the query`, (done) => {
      instance.inject({
        url: key,
        headers: noLocalePaths[key].headers
      }, (response) => {
        should(response.statusCode).equal(302);
        should(response.headers.location).equal(noLocalePaths[key].equal);
        done();
      });
    });
  });
});
