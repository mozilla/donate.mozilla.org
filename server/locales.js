var locales = {};

Object.keys(require('../public/locales.json')).forEach(function(locale) {
  locales[locale.toLowerCase()] = locale;
});

module.exports = locales;
