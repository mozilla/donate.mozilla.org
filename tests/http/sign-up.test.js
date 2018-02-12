const server = require('../../server');
const should = require('should');

process.env.HATCHET_NO_LOG = true;

let instance;

describe('/api/signup/basket', () => {
  before(async(done) => {
    instance = await server();
    done();
  });

  it('should return okay', async(done) => {
    let response = await instance.inject({
      method: 'POST',
      url: '/api/signup/basket',
      payload: {
        locale: 'en-CA',
        email: 'test@example.org',
        country: 'Canada'
      }
    });

    should(response.statusCode).equal(201);
    should(response.headers['content-type']).equal('application/json; charset=utf-8');
    should(response.result).deepEqual({
      format: 'html',
      lang: 'en-CA',
      newsletters: 'mozilla-foundation',
      trigger_welcome: 'N',
      source_url: 'https://donate.mozilla.org/',
      email: 'test@example.org',
      country: 'Canada'
    });

    done();
  });
});
