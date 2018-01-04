const server = require('../../server');
const should = require('should');

var instance;

describe('/api/paypal', () => {

  before(async(done) => {
    instance = await server();
    done();
  });

  it('should return 400 when invalid currency is used', async(done) => {
    let response = await instance.inject({
      method: 'POST',
      url: '/api/paypal',
      payload: {
        frequency: 'onetime',
        description: 'Test',
        amount: 3,
        locale: 'en-US',
        currency: 'buck'
      }
    });

    should(response.statusCode).equal(400);

    done();
  });

  it('should return 400 when undefined currency is used', async(done) => {
    let response = await instance.inject({
      method: 'POST',
      url: '/api/paypal',
      payload: {
        frequency: 'onetime',
        description: 'Test',
        amount: 3,
        locale: 'en-US'
      }
    });

    should(response.statusCode).equal(400);

    done();
  });

  it('should return 400 when unsupported currency is used', async(done) => {
    let response = await instance.inject({
      method: 'POST',
      url: '/api/paypal',
      payload: {
        frequency: 'onetime',
        description: 'Test',
        amount: 3,
        locale: 'en-US',
        currency: 'idr'
      }
    });

    should(response.statusCode).equal(400);

    done();
  });
});
