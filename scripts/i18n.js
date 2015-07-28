var assign = require('react/lib/Object.assign');
var messages = require('../locales/messages');
var locale = navigator.language.split('-');
locale = locale[1] ? `${locale[0]}-${locale[1].toUpperCase()}` : navigator.language;

var strings = messages[locale] ? messages[locale] : messages['en-US'];

module.exports = {
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
}
