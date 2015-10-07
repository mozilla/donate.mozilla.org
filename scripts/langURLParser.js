import i18n from '../locales/i18n.js';
import paths from './paths.js';

module.exports = {
  run: function(Handler, state, cb) {
    var redirect = false;
    var queryString = state.query;
    if(state.query) {
      queryString = state.query;
      redirect = queryString.redirect ? true : false;
    }
    var pathname = queryString && queryString.redirect || state.pathname;
    var langURL = i18n.urlOverrideLang(pathname);
    var currentLang = langURL.lang || i18n.currentLanguage;
    var lang = i18n.isSupportedLanguage(currentLang) ? currentLang : i18n.defaultLang;
    var langInPath = i18n.urlOverrideLang(pathname).lang;

    /*
    * Handle all path in the param only
    * e.g. anything that's not in the /?redirect=pathname
    */
    if(!redirect) {
      // Check first if we have language code in the URL
      // e.g. /en-US/pathname/
      if(langInPath) {
        // check if the given path exist in the paths Array
        // if so we will return and do nothing.
        if(paths.indexOf(pathname) !== -1) {
          if(cb) {
            return cb(pathname);
          }
          return;
        }
        // If we don't have locale in the URL we want to hiject the
      } else if(!langInPath) {
        pathname = '/' + lang + pathname;
        if(paths.indexOf(pathname) !== -1) {
          Handler.replaceWith(pathname, {}, queryString, cb);
        }
      }
    } else if(redirect) {
      // remove `redirect` property from the query object before passing it in the replaceWith()
      delete queryString.redirect;
      if(langInPath) {
        if(paths.indexOf(pathname) !== -1) {
          Handler.replaceWith(pathname, {}, queryString, cb);
        } else {
          pathname = '/' + lang + '/';
          Handler.replaceWith(pathname, {}, queryString, cb);
        }
      } else if(!langInPath) {
        if(paths.indexOf(pathname) !== -1) {
          pathname = '/' + lang + pathname;
          Handler.replaceWith(pathname, {}, queryString, cb);
        } else {
          // let's find out first before going to home page if the pathname without
          // locale does exist in paths Array, so we can redirect with our default locale
          var pathWithoutLang = pathname.split('/');
          pathWithoutLang.splice(1,1);
          pathname = pathWithoutLang.join('/');
          if(paths.indexOf(pathname) !== -1) {
            pathname = '/' + lang + pathname;
            Handler.replaceWith(pathname, {}, queryString, cb);
          } else {
            pathname = '/' + lang + '/';
            Handler.replaceWith(pathname, {}, queryString, cb);
          }
        }
      }
    }
    return;
  }
};
