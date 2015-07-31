var locales,
messages = {},
arr = [];

function getLocales(arr) {
  return arr.map(function(item) {
    return item.replace("./", "").replace(".json", "");
  });
}

function getMessages(arr) {
  req.keys().forEach(function (file) {
    var locale = file.replace('./', '').replace('.json', '');
    messages[locale] = req(file);
  });
}

if (global.window) {
  arr = require.context('./', true, /\.json$/).keys()
  locales = getLocales(arr);
  // This is essentially bulk require
  var req = require.context('./', true, /\.json.*$/);
  getMessages(req);
} else {
  var reqF = require('enhanced-require');
  var req = reqF(module);
  arr = req.context('./', true, /\.json$/).keys();
  locales = getLocales(arr);
}

module.exports = {
  locales: locales,
  messages: messages
};
