var server = require('../../server');
var should = require('should');

var instance = server({ useDomains: false });
process.env.HATCHET_NO_LOG = true;

describe('/api/signup/basket', () => {
  it('should return okay', (done) => {
    instance.inject({
      method: 'POST',
      url: '/api/signup/basket',
      payload: {
        locale: 'en-CA',
        email: 'test@example.org'
      }
    }, (response) => {
      should(response.statusCode).equal(201);
      should(response.headers['content-type']).equal('application/json; charset=utf-8');
      should(response.result).deepEqual({
        format: 'html',
        lang: 'en-CA',
        newsletters: 'mozilla-foundation',
        trigger_welcome: 'N',
        source_url: 'https://donate.mozilla.org/',
        email: 'test@example.org'
      });

      done();
    });
  });
});
