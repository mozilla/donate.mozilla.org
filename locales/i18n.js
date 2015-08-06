import assign from 'react/lib/Object.assign';

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
var exports = {};

var locale = navigator.language.split('-');
locale = locale[1] ? `${locale[0]}-${locale[1].toUpperCase()}` : navigator.language;

var strings = messages[locale] ? messages[locale] : messages['en-US'];
exports = {
  intlData: {
    locales : ['en-US'],
    // Sometimes we will include a language with partial translation
    // and we need to make sure the object that we pass to `intlData`
    // contains all keys based on the `en-US` messages.
    messages: assign(messages['en-US'], strings),
  },
  defaultLang: 'en-US',
  currentLanguage: locale,
  isSupportedLanguage: function(lang) {
    return !!messages[lang];
  },
  intlDataFor: function(lang) {
    // we need to make sure we transform the given locale to the right format first
    // so we can access the right locale in our dictionary for example: pt-br should be transformed to pt-BR
    var locale = lang.split('-');
    locale = locale[1] ? `${locale[0]}-${locale[1].toUpperCase()}` : lang;
    var strings = messages[locale] ? messages[locale] : messages['en-US'];

    return {locales: [locale], messages: assign(messages['en-US'], strings)};
  }
};

module.exports = exports;
