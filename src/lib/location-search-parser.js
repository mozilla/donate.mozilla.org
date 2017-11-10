/**
 * A very simple lib for parsing window.location query parameters
 * (called ".search") into a flat property:value dictionary.
 */
module.exports = function parseLocationSearch(location = {}) {
  if (!location.search) {
    return false;
  }

  let string = location.search.replace('?','');
  let terms = decodeURIComponent(string).split('&');
  let parsed = {};

  terms.forEach( term => {
    term = term.split('=');
    parsed[term[0]] = term[1];
  });

  return parsed;
};

