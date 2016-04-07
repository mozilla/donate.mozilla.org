var langURLParser = require('../../scripts/langURLParser.js');
var should = require('should');

describe('langURLParser.js', function() {
  it('should return true if given path /en-US/ in the paths list', function() {
    should(langURLParser({pathname: '/en-US/'})).be.undefined;
  });
  it('should return true if given path /de/ in the paths list', function() {
    should(langURLParser({pathname: '/de/'})).be.undefined;
  });
  it('should return true if given path /de/thank-you/ in the paths list', function() {
    should(langURLParser({pathname: '/de/thank-you/'})).be.undefined;
  });
  it('should return to "/de/" for the given path /de/thank-you/abcd/ does not exist the paths list', function() {
    should(langURLParser({pathname: '/de/thank-you/abcd/'})).equal('/de/');
  });
  it('should return "/en-US/thank-you/" if given path /thank-you/ exist in the paths list', function() {
    should(langURLParser({pathname: '/thank-you/'})).equal('/en-US/thank-you/');
  });
  it('/de/asdsadasd/ should redirect to /de/', function() {
    should(langURLParser({pathname: '/de/asdsadasd/'})).equal('/de/');
  });
  it('should return "/en-US/" if given path /th-TH/ does not exist in paths list or is not a supported locale', function() {
    should(langURLParser({pathname: '/th-TH/'})).equal('/en-US/');
  });
  it('should return "/en-US/" if given path /th-TH/abc/ does not exist in paths list or is not a supported locale', function() {
    should(langURLParser({pathname: '/th-TH/abc/'})).equal('/en-US/');
  });
  it('should return "/en-US/" if given path /bb/ does not exist in paths list or is not a supported locale', function() {
    should(langURLParser({pathname: '/bb/'})).equal('/en-US/');
  });
  it('should return "/en-US/" if given path "/"', function() {
    should(langURLParser({pathname: '/'})).equal('/en-US/');
  });
  it('should return "/en-US/thank-you/" if given path "/?redirect=/thank-you/"', function() {
    should(langURLParser({query: {redirect: '/thank-you/'}})).equal('/en-US/thank-you/');
  });
  it('should return "/en-US/" if given path "/?redirect=/abcde/"', function() {
    should(langURLParser({query: {redirect: '/abcde/'}})).equal('/en-US/');
  });
  it('should return "/de/" if given path "/?redirect=/de/avc/"', function() {
    should(langURLParser({query: {redirect: '/de/avd/'}})).equal('/de/');
  });
  it('should return "/en-US/thank-you/" if given path "/th-TH/thank-you/"', function() {
    should(langURLParser({query: {redirect: '/th-TH/thank-you/'}})).equal('/en-US/thank-you/');
  });
});
