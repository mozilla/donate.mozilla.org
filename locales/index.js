function getLocales(arr) {
  return arr.map(function(item) {
    return item.replace('./', '').replace('.json', '');
  });
}

var reqF = require('enhanced-require');
var req = reqF(module);
var arr = req.context('./', true, /\.json$/).keys();

module.exports = getLocales(arr);
