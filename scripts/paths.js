import locales from '../public/locales.json';
import pages from '../data/pages.js';

function createPaths(first, arr) {
  var returnArray = [];
  first.forEach(function(item) {
    returnArray = returnArray.concat(arr.map(function(key) {
      return "/" + key + item;
    }));
  });
  return returnArray;
}

var paths = createPaths(Object.keys(pages), Object.keys(locales));
paths.push("/");

module.exports = paths;
