var locales = require('../locales/index.js');
var pages = require('../data/pages.js');
var returnArray = [];

locales.forEach(function(locale) {
  Object.keys(pages).forEach(function(page) {
    returnArray.push({pathname: '/' + locale + page, filename: pages[page].filename});
  });
});

module.exports = returnArray;
