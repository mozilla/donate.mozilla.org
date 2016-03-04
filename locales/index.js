function getLocales(arr) {
  return arr.map(function(item) {
    return item.replace('./', '').replace('.json', '');
  });
}

var reqF = require('enhanced-require');
var req = reqF(module);
if (!req.context) {
  req = require;
}
var supportedLocales = process.env.SUPPORTED_LOCALES || "*";

var arr;
if (supportedLocales === "*") {
  supportedLocales = getLocales(req.context('./', true, /\.json$/).keys());
} else {
  supportedLocales = JSON.parse(supportedLocales);
}

module.exports = supportedLocales;
