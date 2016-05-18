import i18n from '../locales/i18n.js';
import pages from '../data/pages.js';

function redirectURLParser(location) {
  var redirectQuery = false;
  var query = location.query;

  if (query) {
    redirectQuery = decodeURIComponent(query.redirect || "");
  }

  // We don't need to redirect.
  if (!redirectQuery && location.pathname !== "/") {
    return {
      pathname: ""
    };
  }

  var langParse = i18n.urlOverrideLang(redirectQuery);
  var langTest = langParse.test;
  var pathname = langParse.pathname;
  if (pathname) {
    pathname = "/" + pathname + "/";
  }

  var lang = langParse.lang;
  var validLang = lang || i18n.currentLanguage;
  if (!i18n.isSupportedLanguage(validLang)) {
    validLang = i18n.defaultLang;
  }

  // invalid lang but with a valid path.
  if (!langTest && Object.keys(pages).indexOf(redirectQuery) !== -1) {
    pathname = "/" + validLang + redirectQuery;
  } else if (!langTest && Object.keys(pages).indexOf(pathname) !== -1) {
    pathname = "/" + validLang + pathname;
  } else {
    pathname = "/" + validLang + "/";
  }

  if (redirectQuery) {
    pathname += decodeURIComponent(query.query || "");
    query = {};
  }
  return {pathname, query};
}

module.exports = redirectURLParser;
