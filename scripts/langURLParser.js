import i18n from '../locales/i18n.js';
import pages from '../data/pages.js';

function langURLParser(state) {
  var redirectQuery = false;
  var queryString = state.query;

  if (queryString) {
    redirectQuery = queryString.redirect;
  }

  // We don't need to redirect.
  if (!redirectQuery && state.pathname !== "/") {
    return;
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
  if (!langTest && Object.keys(pages).indexOf(pathname) !== -1) {
    return "/" + validLang + pathname;
  }
  // default
  return "/" + validLang + "/";
}

module.exports = langURLParser;
