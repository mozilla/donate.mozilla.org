var should = require('should');
var queryParser = require("../../dist/lib/queryParser.js");
var currencies = require('../../dist/data/currencies.js');
var locale = 'en-US';
var defaultSinglePresets = currencies.usd.presets.single;
var defaultMonthlyPresets = currencies.usd.presets.monthly;

describe("queryParser.js", function() {
  var queryString;
  beforeEach(function() {
    queryString = {};
  });
  it("does not throw with empty object", function() {
    should.doesNotThrow(function() {
      queryParser({}, locale);
    });
  });
  describe("/?presets", function() {
    it("presets=1,2,3,4 should return ['1','2','3','4']", function() {
      queryString.presets = "1,2,3,4";
      queryParser(queryString, locale).initialState.presets.should.containDeep(['1','2','3','4']);
    });
    it("presets=1,2,3, should return the defaultSinglePresets values", function() {
      queryString.presets = "1,2,3,";
      queryParser(queryString, locale).initialState.presets.should.equal(defaultSinglePresets);
    });
    it("presets=1,2,3,4,1,2,3 should return the defaultSinglePresets values", function() {
      queryString.presets = "1,2,3,4,1,2,3";
      queryParser(queryString, locale).initialState.presets.should.equal(defaultSinglePresets);
    });
    it("presets=a,b,c,d should return the defaultSinglePresets values", function() {
      queryString.presets = "a,b,c,d";
      queryParser(queryString, locale).initialState.presets.should.equal(defaultSinglePresets);
    });
    it("presets=NaN should return the defaultSinglePresets values", function() {
      queryString.presets = NaN;
      queryParser(queryString, locale).initialState.presets.should.equal(defaultSinglePresets);
    });
    it("presets=null should return the defaultSinglePresets values", function() {
      queryString.presets = null;
      queryParser(queryString, locale).initialState.presets.should.equal(defaultSinglePresets);
    });
  });
  describe("/?frequency", function() {
    it("frequency=single should return defaultSinglePresets", function() {
      queryString.frequency = "single";
      queryParser(queryString, locale).initialState.presets.should.equal(defaultSinglePresets);
    });
    it("frequency=monthly should return defaultMonthlyPresets", function() {
      queryString.frequency = "monthly";
      queryParser(queryString, locale).initialState.presets.should.equal(defaultMonthlyPresets);
    });
    it("frequency=lol should return defaultSinglePresets", function() {
      queryString.frequency = "lol";
      queryParser(queryString, locale).initialState.presets.should.equal(defaultSinglePresets);
    });
    it("frequency= should return defaultSinglePresets", function() {
      queryString.frequency = "";
      queryParser(queryString, locale).initialState.presets.should.equal(defaultSinglePresets);
    });
    it("frequency=null should return defaultSinglePresets", function() {
      queryString.frequency = null;
      queryParser(queryString, locale).initialState.presets.should.equal(defaultSinglePresets);
    });
    it("frequency=NaN should return defaultSinglePresets", function() {
      queryString.frequency = NaN;
      queryParser(queryString, locale).initialState.presets.should.equal(defaultSinglePresets);
    });
  });
  describe("/?currency", function() {
    it("default should equal to 'usd' object", function() {
      queryParser(queryString, locale).initialState.currency.should.be.an.Object().and.containEql({ code: 'usd'});
    });
    it("/?currency=gbp should return 'gbp' currency object", function() {
      queryString.currency = "gbp";
      queryParser(queryString, locale).initialState.currency.should.be.an.Object().and.containEql({ symbol: '£'});
    });
    it("no currency in de should return 'eur' currency object", function() {
      queryParser(queryString, 'de').initialState.currency.should.be.an.Object().and.containEql({ symbol: '€'});
    });
    it("/?currency=gbp should override de locale and return 'gbp' currency object", function() {
      queryString.currency = "gbp";
      queryParser(queryString, 'de').initialState.currency.should.be.an.Object().and.containEql({ symbol: '£'});
    });
    it("/?currency=blah in de locale should return 'eur' currency object", function() {
      queryString.currency = "blah";
      queryParser(queryString, 'de').initialState.currency.should.be.an.Object().and.containEql({ symbol: '€'});
    });
    it("/?currency=blah should return default 'usd' object", function() {
      queryString.currency = "blah";
      queryParser(queryString, locale).initialState.currency.should.be.an.Object().and.containEql({ symbol: '$', code: 'usd'});
    });
  });
  describe("/?amount", function() {
    it("default should equal to null", function() {
      queryParser(queryString, locale).initialState.amount.should.be.empty();
    });
    it("/?amount=abc should return null", function() {
      queryString.amount = "abc";
      queryParser(queryString, locale).initialState.amount.should.be.empty();
    });
    it("/?amount=123 should return 123", function() {
      queryString.amount = "123 ";
      queryParser(queryString, locale).initialState.amount.should.be.equal('123');
    });
    it("/?amount=NaN should return null", function() {
      queryString.amount = NaN;
      queryParser(queryString, locale).initialState.amount.should.be.empty();
    });
  });
});
