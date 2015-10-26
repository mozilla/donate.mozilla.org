require('habitat').load();

module.exports = {
  "supportedLocales": process.env.SUPPORTED_LOCALES || "*",
  "dest": "locales",
  "src": "locales",
  "paypalLocales": {
    "en-US": "US",
    "de": "DE",
    "fr": "FR",
    "pt-BR": "BR",
    "id": "id_ID"
  }
};
