var should = require('should');
var queryParser = require("../../scripts/queryParser.js");
var currencies = require('../../data/currencies.js');
var pathname = '/en-US/';
var defaultSinglePresets = currencies.usd.presets.single;
var defaultMonthlyPresets = currencies.usd.presets.monthly;
var queryString;

describe("queryParser.js", function () {
  it("does not throw with empty object", function () {
    should.doesNotThrow(function () {
      queryParser({}, pathname);
    });
  });
  describe("/?presets", function () {
    beforeEach(function () {
      queryString = {};
    });
    it("presets=1,2,3,4 should return ['1','2','3','4']", function () {
      queryString.presets = "1,2,3,4";
      queryParser(queryString, pathname).presets.should.containDeep(['1','2','3','4']);
    });
    it("presets=1,2,3, should return the defaultSinglePresets values", function () {
      queryString.presets = "1,2,3,";
      queryParser(queryString, pathname).presets.should.equal(defaultSinglePresets);
    });
    it("presets=1,2,3,4,1,2,3 should return the defaultSinglePresets values", function () {
      queryString.presets = "1,2,3,4,1,2,3";
      queryParser(queryString, pathname).presets.should.equal(defaultSinglePresets);
    });
    it("presets=a,b,c,d should return the defaultSinglePresets values", function () {
      queryString.presets = "a,b,c,d";
      queryParser(queryString, pathname).presets.should.equal(defaultSinglePresets);
    });
    it("presets=NaN should return the defaultSinglePresets values", function () {
      queryString.presets = NaN;
      queryParser(queryString, pathname).presets.should.equal(defaultSinglePresets);
    });
    it("presets=null should return the defaultSinglePresets values", function () {
      queryString.presets = null;
      queryParser(queryString, pathname).presets.should.equal(defaultSinglePresets);
    });
  });
  describe("/?frequency", function () {
    it("frequency=single should return defaultSinglePresets", function () {
      queryString.frequency = "single";
      queryParser(queryString, pathname).presets.should.equal(defaultSinglePresets);
    });
    it("frequency=monthly should return defaultMonthlyPresets", function () {
      queryString.frequency = "monthly";
      queryParser(queryString, pathname).presets.should.equal(defaultMonthlyPresets);
    });
    it("frequency=lol should return defaultSinglePresets", function () {
      queryString.frequency = "lol";
      queryParser(queryString, pathname).presets.should.equal(defaultSinglePresets);
    });
    it("frequency= should return defaultSinglePresets", function () {
      queryString.frequency = "";
      queryParser(queryString, pathname).presets.should.equal(defaultSinglePresets);
    });
    it("frequency=null should return defaultSinglePresets", function () {
      queryString.frequency = null;
      queryParser(queryString, pathname).presets.should.equal(defaultSinglePresets);
    });
    it("frequency=NaN should return defaultSinglePresets", function () {
      queryString.frequency = NaN;
      queryParser(queryString, pathname).presets.should.equal(defaultSinglePresets);
    });
  });
  describe("/?currency", function () {
    it("default should equal to 'usd' object", function () {
      queryParser(queryString, pathname).currency.should.be.an.Object().and.containEql({ code: 'usd'});
    });
    it("/?currency=gbp should return 'gbp' currency object", function () {
      queryString.currency = "gbp";
      queryParser(queryString, pathname).currency.should.be.an.Object().and.containEql({ symbol: '£'});
    });
    it("/?currency=blah should return default 'usd' object", function () {
      queryString.currency = "blah";
      queryParser(queryString, pathname).currency.should.be.an.Object().and.containEql({ symbol: '$', code: 'usd'});
    });
  });
  describe("/?amount", function () {
    it("default should equal to null", function () {
      queryParser(queryString, pathname).amount.should.be.empty();
    });
    it("/?amount=abc should return null", function () {
      queryString.amount = "abc";
      queryParser(queryString, pathname).amount.should.be.empty();
    });
    it("/?amount=123 should return 123", function () {
      queryString.amount = "123 ";
      queryParser(queryString, pathname).amount.should.be.equal('123');
    });
    it("/?amount=NaN should return null", function () {
      queryString.amount = NaN;
      queryParser(queryString, pathname).amount.should.be.empty();
    });
  });
});
