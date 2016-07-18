import assign from 'object-assign';
import locales from '../public/locales.json';

//This is an easy cross browser way to get the preferred language
/** @const */ var DEFAULT_VALUE = 'en-US';
/** @const */ var PREFERRED_LANGUAGE = navigator.language || navigator.userLanguage ||
                  navigator.browserLanguage || navigator.systemLanguage || DEFAULT_VALUE;
var locale = formatLocale(PREFERRED_LANGUAGE);

// we need to make sure we transform the given locale to the right format first
// so we can access the right locale in our directories for example: pt-br should be transformed to pt-BR
function formatLocale(lang) {
  if (lang) {
    lang = lang.split('-');
    return lang[1] ? `${lang[0]}-${lang[1].toUpperCase()}` : lang[0];
  }
}

function urlOverrideLang(path) {
  var localPath = path || location.pathname;
  var localeCode = localPath.split('/')[1];
  localeCode = (/^[a-z]{2,3}(-[A-Z]{2})?$/.test(localeCode)) ? localeCode : null;
  var pathname;
  if (localeCode) {
    // Drop (likely) locale from path.
    pathname = localPath.substring(localPath.indexOf('/', 1) + 1);
  }
  else {
    pathname = localPath.substring(1);
  }
  pathname = pathname.replace(/\/$/, ''); // remove possible trailing slash
  return {
    test: !!locales[localeCode],
    pathname: pathname,
    lang: localeCode
  };
}

function getMessages(locale) {
  var messages = locales[locale] ? locales[locale] : locales['en-US'];
  return assign({}, locales['en-US'], messages);
}

module.exports = {
  intlData: {
    locales : ['en-US'],
    // Sometimes we will include a language with partial translation
    // and we need to make sure the object that we pass to `intlData`
    // contains all keys based on the `en-US` messages.
    messages: getMessages(locale)
  },
  defaultLang: 'en-US',
  currentLanguage: locale,
  isSupportedLanguage: function(lang) {
    return !!locales[lang];
  },
  // This method will check if we have language code in the URL
  // by extracting the pathname from `window.location` and split
  // them to find language code. The expected language code is in the
  // first parameter e.g. /en-US/thank-you. If we don't find the language code
  // we will assume that the URL does not contain language code and return false for `test`
  urlOverrideLang: urlOverrideLang,
  intlDataFor: function(lang) {
    var locale = formatLocale(lang);
    return {locales: [locale], messages: getMessages(locale)};
  }
};
