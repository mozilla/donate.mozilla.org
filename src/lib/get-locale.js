var Parser = require("accept-language-parser");
var bestLang = require("bestlang");

function toLowerCaseArray(array) {
  return array.map(function(item) {
    return item.toLowerCase();
  });
}

function getLocale(acceptLang, locales) {
  var langHeader = Parser.parse(acceptLang);
  var langArray = toLowerCaseArray(langHeader.map(l => l.code + (l.region ? "-" + l.region : "")));

  var locale = bestLang(langArray, Object.keys(locales), 'en-us');
  return locales[locale];
}

module.exports = getLocale;
