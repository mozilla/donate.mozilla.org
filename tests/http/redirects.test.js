var server = require('../../server');
var should = require('should');

describe('redirects', () => {
  var redirects = [
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

  var instance = server({ useDomains: false });

  redirects.forEach((item) => {
    it(`url ${item.url} should redirect to location ${item.location}`, (done) => {
      instance.inject({
        url: item.url
      }, (response) => {
        should(response.headers.location).equal(item.location);
        should(response.statusCode).equal(302);
        done();
      });
    });
  });
});
