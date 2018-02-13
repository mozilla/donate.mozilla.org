var server = require('../../server');
var should = require('should');
var instance;

describe('bad actors', () => {

  before(async(done) => {
    instance = await server();
    done();
  });

  it('should not 500 when accessing /����%20wwwroot.rar', async(done) => {
    let response = await instance.inject({
      url: '/����%20wwwroot.rar'
    });

    should(response.statusCode).equal(302);
    should(response.headers.location).equal('/en-US/%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%2520wwwroot.rar');

    done();
  });
});

