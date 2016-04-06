var server = require('../../server');
var should = require('should');
var instance = server({ useDomains: false });

describe('bad actors', () => {
  it('should not throw error when accessing /����%20wwwroot.rar', (done) => {
    instance.inject({
      url: '/����%20wwwroot.rar',
      headers: {
        'Accept-Language':"fr,en;q=0.5"
      }
    }, (response) => {
      should(response.statusCode).equal(302);
      should(response.headers.location).equal('/fr/');
      done();
    });
  });
});
