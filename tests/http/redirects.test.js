var server = require('../../server');
var should = require('should');

describe('redirects', () => {
  var redirects = [
    {
      url: "/not-here/",
      location: "/?redirect=" + encodeURIComponent("/not-here/")
    },
    {
      url: "/en-US/not-here/",
      location: "/?redirect=" + encodeURIComponent("/en-US/not-here/")
    },
    {
      url: "/en-UR/not-here/",
      location: "/?redirect=" + encodeURIComponent("/en-UR/not-here/")
    },
    {
      url: "/not-here/?key=value",
      location: "/?redirect=" + encodeURIComponent("/not-here/") + "&query=" + encodeURIComponent("?key=value")
    },
    {
      url: "/en-US/not-here/?key=value",
      location: "/?redirect=" + encodeURIComponent("/en-US/not-here/") + "&query=" + encodeURIComponent("?key=value")
    },
    {
      url: "/en-UR/not-here/?key=value",
      location: "/?redirect=" + encodeURIComponent("/en-UR/not-here/") + "&query=" + encodeURIComponent("?key=value")
    },
    {
      url: "/not-here/?key=value&key2=value2",
      location: "/?redirect=" + encodeURIComponent("/not-here/") + "&query=" + encodeURIComponent("?key=value&key2=value2")
    },
    {
      url: "/en-US/not-here/?key=value&key2=value2",
      location: "/?redirect=" + encodeURIComponent("/en-US/not-here/") + "&query=" + encodeURIComponent("?key=value&key2=value2")
    },
    {
      url: "/en-UR/not-here/?key=value&key2=value2",
      location: "/?redirect=" + encodeURIComponent("/en-UR/not-here/") + "&query=" + encodeURIComponent("?key=value&key2=value2")
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
