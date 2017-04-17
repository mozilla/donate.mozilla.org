var server = require('../../server');
var should = require('should');

describe('/api/paypal', () => {
  var instance = server({ useDomains: false });

  it('should return 200 when good options used', (done) => {
    instance.inject({
      method: 'POST',
      url: '/api/paypal',
      payload: {
        frequency: 'onetime',
        description: 'Test',
        amount: 3,
        locale: 'en-US',
        currency: 'usd'
      }
    }, (response) => {
      should(response.statusCode).equal(200);
      should(response.result.endpoint).equal('https://www.sandbox.paypal.com');
      should(response.result.token).be.a.String();

      done();
    });
  });

  it('should return 400 when invalid currency is used', (done) => {
    instance.inject({
      method: 'POST',
      url: '/api/paypal',
      payload: {
        frequency: 'onetime',
        description: 'Test',
        amount: 3,
        locale: 'en-US',
        currency: 'buck'
      }
    }, (response) => {
      should(response.statusCode).equal(400);
      should(response.result.validation.source).equal('payload');
      should(response.result.validation.keys).deepEqual(['currency']);

      done();
    });
  });

  it('should return 400 when undefined currency is used', (done) => {
    instance.inject({
      method: 'POST',
      url: '/api/paypal',
      payload: {
        frequency: 'onetime',
        description: 'Test',
        amount: 3,
        locale: 'en-US'
      }
    }, (response) => {
      should(response.statusCode).equal(400);
      should(response.result.validation.source).equal('payload');
      should(response.result.validation.keys).deepEqual(['currency']);

      done();
    });
  });

  it('should return 400 when unsupported currency is used', (done) => {
    instance.inject({
      method: 'POST',
      url: '/api/paypal',
      payload: {
        frequency: 'onetime',
        description: 'Test',
        amount: 3,
        locale: 'en-US',
        currency: 'idr'
      }
    }, (response) => {
      should(response.statusCode).equal(400);
      should(response.result.validation.source).equal('payload');
      should(response.result.validation.keys).deepEqual(['currency']);

      done();
    });
  });
});
