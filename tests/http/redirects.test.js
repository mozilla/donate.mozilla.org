const server = require('../../server');
const should = require('should');

const redirects = [
  {
    url: "/not-here/",
    location: "/en-US/not-here/"
  },
  {
    url: "/en-US/not-here/",
    location: "/en-US/"
  },
  {
    url: "/en-UR/not-here/",
    location: "/en-US/en-UR/not-here/"
  },
  {
    url: "/en-US/en-UR/not-here/",
    location: "/en-US/"
  },
  {
    url: "/not-here/?key=value",
    location: "/en-US/not-here/?key=value"
  },
  {
    url: "/en-US/not-here/?key=value",
    location: "/en-US/?key=value"
  },
  {
    url: "/en-UR/not-here/?key=value",
    location: "/en-US/en-UR/not-here/?key=value"
  },
  {
    url: "/en-US/en-UR/not-here/?key=value",
    location: "/en-US/?key=value"
  },
  {
    url: "/not-here/?key=value&key2=value2",
    location: "/en-US/not-here/?key=value&key2=value2"
  },
  {
    url: "/en-US/not-here/?key=value&key2=value2",
    location: "/en-US/?key=value&key2=value2"
  },
  {
    url: "/en-UR/not-here/?key=value&key2=value2",
    location: "/en-US/en-UR/not-here/?key=value&key2=value2"
  },
  {
    url: "/en-US/en-UR/not-here/?key=value&key2=value2",
    location: "/en-US/?key=value&key2=value2"
  }
];

let instance;

describe('redirects', () => {

  before(async(done) => {
    instance = await server();
    done();
  });

  redirects.forEach((item) => {
    it(`url ${item.url} should redirect to location ${item.location}`, async(done) => {
      let response = await instance.inject({
        url: item.url
      });

      should(response.headers.location).equal(item.location);
      should(response.statusCode).equal(302);
      done();
    });
  });
});
