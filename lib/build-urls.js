var Parser = require("accept-language-parser");
var bestLang = require('bestlang');
var paths = require('../data/paths.js');
var pages = require('../data/pages.js');
var locales = require('../locales/index.js');
var Path = require('path');
var url = require('url');

function processPage(request, reply, page) {
  var header = Parser.parse(request.headers["accept-language"]);
  var languages_array = header.map(function(l) {
    return l.code + (l.region ? "-" + l.region : "");
  });
  var query = '';
  if (request.url.search) {
    query = request.url.search;
  }
  reply.redirect(url.format('/' + bestLang(languages_array, locales, 'en-US') + page + query))
  .vary("Accept-Language");
}

module.exports = function() {
  var returnPages = [];
  // build static URLs for pages with locales that we support e.g. /en-US/thank-you/
  paths.forEach(function(page) {
    returnPages.push({
      method: 'GET',
      path: page.pathname,
      handler: {
        file: Path.join(__dirname, '../public', page.pathname, 'index.html')
      },
      config: {
        cache: {
          expiresIn: 300 * 1000, // 5 minutes
          privacy: 'public'
        }
      }
    });
  });

  // paths with no locales /thank-you/ etc.
  Object.keys(pages).forEach(function(path) {
    returnPages.push({
      method: 'GET',
      path: path,
      handler: function(request, reply) {
        processPage(request, reply, path);
      },
      config: {
        cache: {
          expiresIn: 300 * 1000, // 5 minutes
          privacy: 'public'
        }
      }
    });
  });
  // build URLs for pages with locales that we don't support e.g. /no-NO/thank-you/
  Object.keys(pages).forEach(function(page) {
    returnPages.push({
      method: 'GET',
      path: '/{locales}' + page,
      handler: function(request, reply) {
        processPage(request, reply, page);
      },
      config: {
        cache: {
          expiresIn: 300 * 1000, // 5 minutes
          privacy: 'public'
        }
      }
    });
  });

  return returnPages;
};
