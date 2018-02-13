const server = require('../../server');
const should = require('should');

const type = 'application/json; charset=utf-8';
const cache = 'max-age=300, must-revalidate, public';
const files = {
  '/api/exchange-rates/latest.json': {
    type,
    cache
  }
};

var instance;

describe('test exchange rates api', () => {

  before(async(done) => {
    instance = await server();
    done();
  });

  Object.keys(files).forEach((key) => {
    it(`should return okay when accessing ${key}`, async(done) => {
      let response = await instance.inject({
        url: key
      });

      should(response.statusCode).equal(200);
      should(response.headers['content-type']).equal(type);
      should(response.headers['cache-control']).equal(cache);

      done();
    });
  });
});
