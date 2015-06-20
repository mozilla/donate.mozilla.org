import currencies from './currencies.js';
import locales from "../locales";
import pages from "./pages.js";

function getLocalePaths(arr) {
  var returnArray = [];
  returnArray = returnArray.concat(arr.map(function(key) {
    return '/sequential-' + key;
  }));
  returnArray = returnArray.concat(arr.map(function(key) {
    return '/thank-you-' + key;
  }));
  return returnArray;
}

function getCurrenciesPaths(arr) {
	return arr.map(function(key) {
		return '/paypal-donate-' + key;
	});
}

var paths = Object.keys(pages);
paths = paths.concat(getLocalePaths(locales));
paths = paths.concat(getCurrenciesPaths(Object.keys(currencies)));

module.exports = paths;
