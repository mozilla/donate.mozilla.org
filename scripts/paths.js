import locales from '../public/locales.json';
import pages from '../data/pages.js';
var localeString = ':locale';

function createPaths(first, arr, isLocale) {
  var returnArray = [];
  first.forEach(function(item) {
    returnArray = returnArray.concat(arr.map(function(key) {
      if (item.indexOf(localeString) !== -1 && isLocale) {
        return item.replace(localeString, key);
      }
      return item;
    }));
  });
  return returnArray;
}

// create an array of paths from pages object.
// this should include paths with :locale? in them.
var pathWithOptional = [];
Object.keys(pages).forEach(function(item) {
  pathWithOptional.push(pages[item].path);
});

var paths = Object.keys(pages);
paths = paths.concat(createPaths(pathWithOptional, Object.keys(locales), true));

module.exports = paths;
