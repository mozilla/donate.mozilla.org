var should = require('should');
var queryParser = require("../../scripts/queryParser.js");
var currencies = require('../../data/currencies.js');
var pathname = '/en-US/';
var defaultSinglePresets = currencies.usd.presets.single;
var defaultMonthlyPresets = currencies.usd.presets.monthly;

describe("queryParser.js", function() {
  var queryString;
  beforeEach(function() {
    queryString = {};
  });
  it("does not throw with empty object", function() {
    should.doesNotThrow(function() {
      queryParser({}, pathname);
    });
  });
  describe("/?presets", function() {
    it("presets=1,2,3,4 should return ['1','2','3','4']", function() {
      queryString.presets = "1,2,3,4";
      queryParser(queryString, pathname).presets.should.containDeep(['1','2','3','4']);
    });
    it("presets=1,2,3, should return the defaultSinglePresets values", function() {
      queryString.presets = "1,2,3,";
      queryParser(queryString, pathname).presets.should.equal(defaultSinglePresets);
    });
    it("presets=1,2,3,4,1,2,3 should return the defaultSinglePresets values", function() {
      queryString.presets = "1,2,3,4,1,2,3";
      queryParser(queryString, pathname).presets.should.equal(defaultSinglePresets);
    });
    it("presets=a,b,c,d should return the defaultSinglePresets values", function() {
      queryString.presets = "a,b,c,d";
      queryParser(queryString, pathname).presets.should.equal(defaultSinglePresets);
    });
    it("presets=NaN should return the defaultSinglePresets values", function() {
      queryString.presets = NaN;
      queryParser(queryString, pathname).presets.should.equal(defaultSinglePresets);
    });
    it("presets=null should return the defaultSinglePresets values", function() {
      queryString.presets = null;
      queryParser(queryString, pathname).presets.should.equal(defaultSinglePresets);
    });
  });
  describe("/?frequency", function() {
    it("frequency=single should return defaultSinglePresets", function() {
      queryString.frequency = "single";
      queryParser(queryString, pathname).presets.should.equal(defaultSinglePresets);
    });
    it("frequency=monthly should return defaultMonthlyPresets", function() {
      queryString.frequency = "monthly";
      queryParser(queryString, pathname).presets.should.equal(defaultMonthlyPresets);
    });
    it("frequency=lol should return defaultSinglePresets", function() {
      queryString.frequency = "lol";
      queryParser(queryString, pathname).presets.should.equal(defaultSinglePresets);
    });
    it("frequency= should return defaultSinglePresets", function() {
      queryString.frequency = "";
      queryParser(queryString, pathname).presets.should.equal(defaultSinglePresets);
    });
    it("frequency=null should return defaultSinglePresets", function() {
      queryString.frequency = null;
      queryParser(queryString, pathname).presets.should.equal(defaultSinglePresets);
    });
    it("frequency=NaN should return defaultSinglePresets", function() {
      queryString.frequency = NaN;
      queryParser(queryString, pathname).presets.should.equal(defaultSinglePresets);
    });
  });
  describe("/?currency", function() {
    it("default should equal to 'usd' object", function() {
      queryParser(queryString, pathname).currency.should.be.an.Object().and.containEql({ code: 'usd'});
    });
    it("/?currency=gbp should return 'gbp' currency object", function() {
      queryString.currency = "gbp";
      queryParser(queryString, pathname).currency.should.be.an.Object().and.containEql({ symbol: '£'});
    });
    it("no currency in de should return 'eur' currency object", function() {
      queryParser(queryString, '/de/').currency.should.be.an.Object().and.containEql({ symbol: '€'});
    });
    it("/?currency=gbp should override de locale and return 'gbp' currency object", function() {
      queryString.currency = "gbp";
      queryParser(queryString, '/de/').currency.should.be.an.Object().and.containEql({ symbol: '£'});
    });
    it("/?currency=blah in de locale should return 'eur' currency object", function() {
      queryString.currency = "blah";
      queryParser(queryString, '/de/').currency.should.be.an.Object().and.containEql({ symbol: '€'});
    });
    it("/?currency=blah should return default 'usd' object", function() {
      queryString.currency = "blah";
      queryParser(queryString, pathname).currency.should.be.an.Object().and.containEql({ symbol: '$', code: 'usd'});
    });
  });
  describe("/?amount", function() {
    it("default should equal to null", function() {
      queryParser(queryString, pathname).amount.should.be.empty();
    });
    it("/?amount=abc should return null", function() {
      queryString.amount = "abc";
      queryParser(queryString, pathname).amount.should.be.empty();
    });
    it("/?amount=123 should return 123", function() {
      queryString.amount = "123 ";
      queryParser(queryString, pathname).amount.should.be.equal('123');
    });
    it("/?amount=NaN should return null", function() {
      queryString.amount = NaN;
      queryParser(queryString, pathname).amount.should.be.empty();
    });
  });
  describe("/?country", function() {
    // locales set with no country set
    it("/locale en-US should return US", function() {
      queryParser(queryString, '/en-US/').country.should.be.equal('US');
    });
    it("/locale en-CA should return CA", function() {
      queryParser(queryString, '/en-CA/').country.should.be.equal('CA');
    });
    it("/locale en-GB should return GB", function() {
      queryParser(queryString, '/en-GB/').country.should.be.equal('GB');
    });
    it("/locale es should return ES", function() {
      queryParser(queryString, '/es/').country.should.be.equal('ES');
    });
    it("/locale de should return DE", function() {
      queryParser(queryString, '/de/').country.should.be.equal('DE');
    });
    it("/locale pt-BR should return BR", function() {
      queryParser(queryString, '/pt-BR/').country.should.be.equal('BR');
    });
    it("/locale fr should return FR", function() {
      queryParser(queryString, '/fr/').country.should.be.equal('FR');
    });

    // defaults to US
    it("default should equal to US", function() {
      queryParser(queryString, '/').country.should.be.equal('US');
    });

    // locale override false like values
    it("'' country with en-GB locale should return GB", function() {
      queryString.country = "";
      queryParser(queryString, '/en-GB/').country.should.be.equal('GB');
    });
    it("0 country with en-CA should return CA", function() {
      queryString.country = 0;
      queryParser(queryString, '/en-CA/').country.should.be.equal('CA');
    });
    it("false with de should return DE", function() {
      queryString.country = false;
      queryParser(queryString, '/de/').country.should.be.equal('DE');
    });

    // ?country override locale
    it("/?country=US should return US over locale", function() {
      queryString.country = "US";
      queryParser(queryString, '/en-CA/').country.should.be.equal('US');
    });
    it("/?country=CA should return CA over locale", function() {
      queryString.country = "CA";
      queryParser(queryString, pathname).country.should.be.equal('CA');
    });
    it("/?country=GB should return GB over locale", function() {
      queryString.country = "GB";
      queryParser(queryString, pathname).country.should.be.equal('GB');
    });
    it("/?country=DE should return DE over locale", function() {
      queryString.country = "DE";
      queryParser(queryString, pathname).country.should.be.equal('DE');
    });
    it("/?country=BR should return BR over locale", function() {
      queryString.country = "BR";
      queryParser(queryString, pathname).country.should.be.equal('BR');
    });
    it("/?country=FR should return FR over locale", function() {
      queryString.country = "FR";
      queryParser(queryString, pathname).country.should.be.equal('FR');
    });
    it("/?country=ES should return ES over locale", function() {
      queryString.country = "ES";
      queryParser(queryString, pathname).country.should.be.equal('ES');
    });
  });
});
