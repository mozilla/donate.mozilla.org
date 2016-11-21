var getLocale = require('./get-locale.js');
function getLocation(location) {
  return "/" + location.split("/").splice(2).join("/");
}

module.exports = function(langmap, locales) {
  return function(acceptLang, location) {
    var locationSplit = location.split("/");
    var locale = locationSplit[1];
    var redirect = "";

    if (!locale || (!langmap[locale] && !locales[locale.toLowerCase()])) {
      // No locale or not a valid locale.
      locale = getLocale(acceptLang, locales);
      redirect = location;
    } else if (!locales[locale.toLowerCase()]) {
      // We have a valid locale, but we currently don't support it.
      locale = getLocale(acceptLang, locales);
      redirect = getLocation(location);
    }

    return ({
      locale,
      redirect
    });
  };
};
