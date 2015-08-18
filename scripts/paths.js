import currencies from '../data/currencies.js';
import locales from '../locales/index.js';
import pages from '../data/pages.js';
var localeString = ':locale';
var currencyString = ':currency';

function createPaths(first, arr, isLocale) {
  var returnArray = [];
  first.forEach(function(item) {
    returnArray = returnArray.concat(arr.map(function(key) {
      if(item.indexOf(localeString) !== -1 && isLocale) {
        return item.replace(localeString, key).replace('?', '');
      } else if(item.indexOf(currencyString) !== -1) {
        return item.replace(currencyString, key);
      } else {
        return item;
      }
    }));
  });
  return returnArray;
}

// create an array of paths from pages object.
// this should include paths with :locale? and :currencies in them.
var pathWithOptional = [];
Object.keys(pages).forEach(function(item) {
  pathWithOptional.push(pages[item].path);
});

var paths = Object.keys(pages);
paths = paths.concat(createPaths(pathWithOptional, locales, true));
// we want to only filter currencies path before calling `createPaths` again
// so that we don't have to go through a lot of checks in the function.
var currenciesArr = paths.filter(function(item) {
  return item.indexOf(currencyString) !== -1;
});
paths = paths.concat(createPaths(currenciesArr, Object.keys(currencies), false));

module.exports = paths;
