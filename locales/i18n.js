import assign from 'react/lib/Object.assign';
import locales from '../locales/index.js';

function getMessages(req) {
  var messages = {};
  req.keys().forEach(function (file) {
    var locale = file.replace('./', '').replace('.json', '');
    messages[locale] = req(file);
  });
  return messages;
}

// This is essentially bulk require
var req = require.context('./', true, /\.json.*$/);
var messages = getMessages(req);

var locale = navigator.language.split('-');
locale = locale[1] ? `${locale[0]}-${locale[1].toUpperCase()}` : navigator.language;

var strings = messages[locale] ? messages[locale] : messages['en-US'];
module.exports = {
  intlData: {
    locales : ['en-US'],
    // Sometimes we will include a language with partial translation
    // and we need to make sure the object that we pass to `intlData`
    // contains all keys based on the `en-US` messages.
    messages: assign({}, messages['en-US'], strings)
  },
  defaultLang: 'en-US',
  currentLanguage: locale,
  isSupportedLanguage: function(lang) {
    return !!messages[lang];
  },
  // This method will check if we have language code in the URL
  // by extracting the pathname from `window.location` and split
  // them to find language code. The expected language code is in the
  // first parameter e.g. /en-US/thank-you. If we don't find the language code
  // we will assume that the URL does not contain language code and return false for `test`
  urlOverrideLang: function(path) {
    var localPath = path || location.pathname;
    var localeCode = localPath.split('/')[1];
    var pathname = localPath.split('/')[2];
    return {
      test: locales.indexOf(localeCode) !== -1,
      pathname: pathname,
      lang: locales.indexOf(localeCode) !== -1 ? localeCode : null
    };
  },
  intlDataFor: function(lang) {
    // we need to make sure we transform the given locale to the right format first
    // so we can access the right locale in our dictionary for example: pt-br should be transformed to pt-BR
    var locale = lang.split('-');
    locale = locale[1] ? `${locale[0]}-${locale[1].toUpperCase()}` : lang;
    var strings = messages[locale] ? messages[locale] : messages['en-US'];
    return {locales: [locale], messages: assign({}, messages['en-US'], strings)};
  }
};
