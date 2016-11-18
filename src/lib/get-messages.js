import assign from 'object-assign';
import locales from '../../public/locales.json';

function getMessages(locale) {
  if (['es-AR', 'es-CL', 'es-MX', 'es-XL'].indexOf(locale) >= 0) {
    locale = 'es';
  }
  return assign({}, locales['en-US'], locales[locale]);
}

module.exports = getMessages;
