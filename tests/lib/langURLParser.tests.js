var langURLParser = require('../../scripts/langURLParser.js');
var should = require('should');

describe('langURLParser.js', function() {
  it('should return undefined for the pathname /en-US/', function() {
    should(langURLParser({pathname: '/en-US/'})).be.undefined;
  });
  it('should return undefined for the pathname /de/', function() {
    should(langURLParser({pathname: '/de/'})).be.undefined;
  });
  it('should return undefined for the pathname /de/thank-you/', function() {
    should(langURLParser({pathname: '/de/thank-you/'})).be.undefined;
  });
  it('should redirect to "/en-US/" for the pathname "/"', function() {
    should(langURLParser({pathname: "/"})).equal('/en-US/');
  });
  it('should redirect to "/de/" for the redirect query /de/thank-you/abcd/', function() {
    should(langURLParser({query: {redirect: '/de/thank-you/abcd/'}})).equal('/de/');
  });
  it('should redirect to "/en-US/thank-you/" for the redirect query /thank-you/', function() {
    should(langURLParser({query: {redirect: '/thank-you/'}})).equal('/en-US/thank-you/');
  });
  it('should redirect to /de/ for the redirect query /de/asdsadasd/ ', function() {
    should(langURLParser({query: {redirect: '/de/asdsadasd/'}})).equal('/de/');
  });
  it('should redirect to "/en-US/" for the redirect query /th-TH/ which is not a supported locale', function() {
    should(langURLParser({query: {redirect: '/th-TH/'}})).equal('/en-US/');
  });
  it('should redirect to "/en-US/" for the redirect query /fa-KE/ which is not a real locale', function() {
    should(langURLParser({query: {redirect: '/fa-KE/'}})).equal('/en-US/');
  });
  it('should redirect to "/en-US/" for the redirect query /th-TH/abc/', function() {
    should(langURLParser({query: {redirect: '/th-TH/abc/'}})).equal('/en-US/');
  });


  it('should redirect to "/en-US/thank-you/" for the redirect query "/fa-KE/thank-you/"', function() {
    should(langURLParser({query: {redirect: '/fa-KE/thank-you/'}})).equal('/en-US/thank-you/');
  });
});
