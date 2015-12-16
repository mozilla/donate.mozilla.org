var server = require('../../server');
var should = require('should');

describe('test exchange rates api', () => {
  var instance = server({ useDomains: false });
  var type = 'application/json; charset=utf-8';

  var cache = 'max-age=300, must-revalidate, public';

  var files = {
    '/api/exchange-rates/latest.json': {
      type,
      cache
    },
    '/exchange-rates/rates-backup.json': {
      type,
      cache
    }
  };

  Object.keys(files).forEach((key) => {
    it(`should return okay when accessing ${key}`, (done) => {
      instance.inject({
        url: key
      }, (response) => {
        should(response.statusCode).equal(200);
        should(response.headers['content-type']).equal(type);
        should(response.headers['cache-control']).equal(cache);
        done();
      });
    });
  });
});
