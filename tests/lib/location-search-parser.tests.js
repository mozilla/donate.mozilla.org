var should = require('should');
var locationSearchParser = require("../../src/lib/location-search-parser.js");

describe("locationSearchParser.js", function() {
  var location;
  beforeEach(function() {
    location = { search: ''};
  });
  it("does not throw without search string", function() {
    should.doesNotThrow(function() {
      locationSearchParser(false);
    });
  });
  it("does not throw with empty search string", function() {
    should.doesNotThrow(function() {
      locationSearchParser(location);
    });
  });
  describe("/?prop=value", function() {
    it("/?a=b", function() {
      location.search = "?a=b";
      locationSearchParser(location).should.deepEqual({a:'b'});
    });
    it("/?a=b&c=d", function() {
      location.search = "?a=b&c=d";
      locationSearchParser(location).should.deepEqual({a:'b', c:'d'});
    });
    it("/?a=b+c+d", function() {
      location.search = "?a=b+c+d";
      locationSearchParser(location).should.deepEqual({a:'b+c+d'});
    });
    it("/?a=b%20c%20d", function() {
      location.search = "?a=b%20c%20d";
      locationSearchParser(location).should.deepEqual({a:'b c d'});
    });
  });
});
