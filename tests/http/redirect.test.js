"use strict";

var server = require('../../server');
var should = require('should');

describe('redirect urls', () => {
  var urls = {
    '/en-CA': {
      headers: {
        'Accept-Language':"en-CA,en;q=0.5"
      },
      location: '/en-CA/'
    },
    '/fr': {
      headers: {
        'Accept-Language':"en-CA,en;q=0.5"
      },
      location: '/fr/'
    },
    '/fr/thank-you': {
      headers: {
        'Accept-Language':"en-CA,en;q=0.5"
      },
      location: '/fr/thank-you/'
    },
    '/thank-you': {
      headers: {
        'Accept-Language':"fr,en;q=0.5"
      },
      location: '/fr/thank-you/'
    },
    '/thunderbird/thank-you': {
      headers: {
        'Accept-Language':"fr,en;q=0.5"
      },
      location: '/fr/thunderbird/thank-you/'
    },
    '/fr/thunderbird/thank-you': {
      headers: {
        'Accept-Language':"fr,en;q=0.5"
      },
      location: '/fr/thunderbird/thank-you/'
    },
    '/about': {
      headers: {
        'Accept-Language':"en;q=0.5"
      },
      location: '/en-US/about/'
    },
    '/en-CA/about': {
      headers: {
        'Accept-Language':"en;q=0.5"
      },
      location: '/en-CA/about/'
    },
    '/xx/about': {
      headers: {
        'Accept-Language':"en;q=0.5"
      },
      location: '/en-US/about/'
    },
    '/xx/thunderbird/about': {
      headers: {
        'Accept-Language':"en;q=0.5"
      },
      location: '/en-US/thunderbird/about/'
    },
    '/me/thunderbird/about/': {
      headers: {
        'Accept-Language':"en;q=0.5"
      },
      location: '/en-US/thunderbird/about/'
    },
    '/me/me': {
      headers: {
        'Accept-Language':"en;q=0.5"
      },
      location: '/en-US/'
    },
    '/thunderbird/about': {
      headers: {
        'Accept-Language':"en;q=0.5"
      },
      location: '/en-US/thunderbird/about/'
    },
    '/hsb/about': {
      headers: {
        'Accept-Language':"en;q=0.5"
      },
      location: '/en-US/about/'
    }
  };

  var instance = server({ useDomains: false });
  Object.keys(urls).forEach((url) => {
    it(`should return okay and redirect to ${urls[url].location} when accessing ${url}`, (done) => {
      let headers = urls[url].headers;
      instance.inject({
        headers,
        url: url
      }, (response) => {
        should(response.statusCode).equal(302);
        should(response.headers.location).equal(urls[url].location);
        done();
      });
    });
  });
});
