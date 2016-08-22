import i18n from './i18n.js';
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
  var pathname = langParse.pathname;
  if (pathname) {
    pathname = "/" + pathname + "/";
  }

  var validLang = langParse.lang || i18n.currentLanguage;
  if (!i18n.isSupportedLanguage(validLang)) {
    validLang = i18n.defaultLang;
  }

  if (Object.keys(pages).indexOf(pathname) !== -1) {
    pathname = "/" + validLang + pathname;
  } else {
    pathname = "/" + validLang + "/";
  }
  if (redirectQuery) {
    // Query is encoded as a string,
    // so we don't parse it, and add it to the pathname
    pathname += decodeURIComponent(query.query || "");
    return {pathname};
  }
  return {pathname, query};
}

module.exports = redirectURLParser;
