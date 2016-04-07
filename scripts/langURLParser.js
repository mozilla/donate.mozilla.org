import i18n from '../locales/i18n.js';
import paths from './paths.js';

module.exports = function(state) {
  var redirectQuery = false;
  var queryString = state.query;
  if (state.query) {
    queryString = state.query;
    redirectQuery = queryString.redirect;
  }
  var pathname = queryString && queryString.redirect || state.pathname;
  var langURL = i18n.urlOverrideLang(pathname);
  var currentLang = langURL.lang || i18n.currentLanguage;
  var lang = i18n.isSupportedLanguage(currentLang) ? currentLang : i18n.defaultLang;
  var langInPath = i18n.urlOverrideLang(pathname).lang;
  var defaultPath = '/' + lang + '/';

  /*
  * Handle all path in the param only
  * e.g. anything that's not in the /?redirect=pathname
  */
  if (!redirectQuery) {
    // Check first if we have language code in the URL
    // e.g. /en-US/pathname/
    if (langInPath) {
      // check if the given path exist in the paths Array
      // if so we will return and do nothing.
      if (paths.indexOf(pathname) !== -1) {
        return;
      }
      return defaultPath;
      // If we don't have locale in the URL we want to hiject the
      // /thank-you/ -> /en-US/thank-you/
    }
    pathname = '/' + lang + pathname;
    if (paths.indexOf(pathname) !== -1) {
      return pathname;
    }
    return defaultPath;
  } else if (langInPath) {
    if (paths.indexOf(pathname) !== -1) {
      return;
    }
    return defaultPath;
  } else if (paths.indexOf(pathname) !== -1) {
    return '/' + lang + pathname;
  }
  // let's find out first before going to home page if the pathname without
  // locale does exist in paths Array, so we can redirect with our default locale
  let pathWithoutLang = pathname.split('/');
  pathWithoutLang.splice(1,1);
  pathname = pathWithoutLang.join('/');
  if (paths.indexOf(pathname) !== -1) {
    return '/' + lang + pathname;
  }
  return defaultPath;
};
