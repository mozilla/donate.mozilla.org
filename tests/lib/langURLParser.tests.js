var should = require('should');
var langURLParser = require('../../scripts/langURLParser.js');

describe('langURLParser.js', function () {
  it('should return true if given path /en-US/ in the paths list', function () {
    langURLParser({pathname: '/en-US/'}, function(returnPath) {
      should(returnPath).equal('/en-US/');
    });
  });
  it('should return true if given path /de/ in the paths list', function () {
    langURLParser({pathname: '/de/'}, function(returnPath) {
      should(returnPath).equal('/de/');
    });
  });
  it('should return true if given path /de/thank-you/ in the paths list', function () {
    langURLParser({pathname: '/de/thank-you/'}, function(returnPath) {
      should(returnPath).equal('/de/thank-you/');
    });
  });
  it('should return to "/de/" for the given path /de/thank-you/abcd/ does not exist the paths list', function () {
    langURLParser({pathname: '/de/thank-you/abcd/'}, function(returnPath) {
      should(returnPath).equal('/de/');
    });
  });
  it('should return "/en-US/thank-you/" if given path /thank-you/ exist in the paths list', function () {
    langURLParser({pathname: '/thank-you/'}, function(returnPath) {
      should(returnPath).equal('/en-US/thank-you/');
    });
  });
  it('/de/asdsadasd/ should redirect to /de/', function() {
    langURLParser({pathname: '/de/asdsadasd/'}, function(returnPath) {
      should(returnPath).equal('/de/');
    });
  });
  it('should return "/en-US/" if given path /th-TH/ does not exist in paths list or is not a supported locale', function () {
    langURLParser({pathname: '/th-TH/'}, function(returnPath) {
      should(returnPath).equal('/en-US/');
    });
  });
  it('should return "/en-US/" if given path /th-TH/abc/ does not exist in paths list or is not a supported locale', function () {
    langURLParser({pathname: '/th-TH/abc/'}, function(returnPath) {
      should(returnPath).equal('/en-US/');
    });
  });
  it('should return "/en-US/" if given path /bb/ does not exist in paths list or is not a supported locale', function () {
    langURLParser({pathname: '/bb/'}, function(returnPath) {
      should(returnPath).equal('/en-US/');
    });
  });
  it('should return "/en-US/" if given path "/"', function () {
    langURLParser({pathname: '/'}, function(returnPath) {
      should(returnPath).equal('/en-US/');
    });
  });
  it('should return "/en-US/thank-you/" if given path "/?redirect=/thank-you/"', function () {
    langURLParser({query: {redirect: '/thank-you/'}}, function(returnPath) {
      should(returnPath).equal('/en-US/thank-you/');
    });
  });
  it('should return "/en-US/" if given path "/?redirect=/abcde/"', function () {
    langURLParser({query: {redirect: '/abcde/'}}, function(returnPath) {
      should(returnPath).equal('/en-US/');
    });
  });
  it('should return "/de/" if given path "/?redirect=/de/avc/"', function () {
    langURLParser({query: {redirect: '/de/avd/'}}, function(returnPath) {
      should(returnPath).equal('/de/');
    });
  });
  it('should return "/en-US/thank-you/" if given path "/th-TH/thank-you/"', function () {
    langURLParser({query: {redirect: '/th-TH/thank-you/'}}, function(returnPath) {
      should(returnPath).equal('/en-US/thank-you/');
    });
  });
});
