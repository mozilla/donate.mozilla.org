var locales;

function getLocales(arr) {
	return arr.map(function(item) {
		return item.replace("./", "").replace(".json", "");
	});
}

if (global.window) {
	locales = getLocales(require.context('./', true, /\.json$/).keys());
} else {
	var reqF = require('enhanced-require');
	var req = reqF(module);
	locales = getLocales(req.context('./', true, /\.json$/).keys());
}

module.exports = locales;
