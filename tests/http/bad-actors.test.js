var server = require('../../server');
var should = require('should');
var instance = server({ useDomains: false });

describe('bad actors', () => {
  it('should not throw error when accessing /����%20wwwroot.rar', (done) => {
    instance.inject({
        url: '/����%20wwwroot.rar'
      }, (response) => {
        should(response.statusCode).equal(400);
        should(response.result.message).equal('Location cannot contain or convert into non-ascii characters');

        done();
      });
  });
});
