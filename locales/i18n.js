import assign from 'react/lib/Object.assign';
import locales from '../locales/index.js';

var supportedLocales = process.env.SUPPORTED_LOCALES || "*";

// This is essentially bulk require
var req = require.context('./', false, /\.json$/);
if (supportedLocales === "*") {
  supportedLocales = req.keys();
} else {
  supportedLocales = JSON.parse(supportedLocales);
}

var directories = getAllMessages(req, supportedLocales);
//This is an easy cross browser way to get the preferred language
/** @const */ var DEFAULT_VALUE = 'en';
/** @const */ var PREFERRED_LANGUAGE = navigator.language || navigator.userLanguage ||
                  navigator.browserLanguage || navigator.systemLanguage || DEFAULT_VALUE;
var locale = formatLocale(PREFERRED_LANGUAGE);

function getAllMessages(req, keys) {
  var messages = {};
  keys.forEach(function(key) {
    // key can be either a file name if we're a bulk require,
    // or a locale string if we're using supportedLocales array.
    var locale = key.replace('./', '').replace('.json', '');
    messages[locale] = req('./' + locale + '.json');
  });
  return messages;
}

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
  var pathname = localPath.split('/')[2];
  return {
    test: locales.indexOf(localeCode) !== -1,
    pathname: pathname,
    lang: locales.indexOf(localeCode) !== -1 ? localeCode : null
  };
}

function getMessages(locale) {
  var messages = directories[locale] ? directories[locale] : directories['en-US'];
  return assign({}, directories['en-US'], messages);
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
    return !!directories[lang];
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
