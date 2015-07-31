// This is essentially bulk require
if (global.window) {
	var req = require.context('./', true, /\.json.*$/);
	var exports = {};
	req.keys().forEach(function (file) {
	  var locale = file.replace('./', '').replace('.json', '');
	  exports[locale] = req(file);
	});
} else {
	var reqF = require('enhanced-require');
	var req = reqF(module);
	var req = require.context('./', true, /\.json.*$/);
	var exports = {};
	req.keys().forEach(function (file) {
	  var locale = file.replace('./', '').replace('.json', '');
	  exports[locale] = req(file);
	});
}
module.exports = exports;
