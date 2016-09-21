var server = require('../../server');
var should = require('should');
var instance = server({ useDomains: false });

describe('bad actors', () => {
  it('should not 500 when accessing /����%20wwwroot.rar', (done) => {
    instance.inject({
      url: '/����%20wwwroot.rar'
    }, (response) => {
      should(response.statusCode).equal(302);
      should(response.headers.location).equal('/en-US/%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%2520wwwroot.rar');

      done();
    });
  });
});

