var server = require('../../server');
var should = require('should');

describe('test exchange rates api', () => {
  var instance = server({ useDomains: false });

  it('should return okay when accessing /api/exchange-rates', (done) => {
    instance.inject({
      url: '/api/exchange-rates/latest.json'
    }, (response) => {
      should(response.statusCode).equal(200);
      should(response.headers['content-type']).equal('application/json; charset=utf-8');
      should(response.headers['cache-control']).equal('max-age=300, must-revalidate, public');
      done();
    });
  });
});
