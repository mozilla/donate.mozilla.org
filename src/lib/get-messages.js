import assign from 'object-assign';
import locales from '../../public/locales.json';

function getMessages(locale) {
  if (locale === 'es-MX') {
    locale = 'es';
  }
  return assign({}, locales['en-US'], locales[locale]);
}

module.exports = getMessages;
