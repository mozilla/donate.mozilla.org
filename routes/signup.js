var httpRequest = require('request');

module.exports = function(transaction, callback) {
  var url = process.env.SIGNUP;
  callback = callback || function() {};
  httpRequest.post({
    url: url,
    json: true,
    form: {
      format: 'html',
      lang: transaction.locale,
      newsletters: 'mozilla-foundation',
      trigger_welcome: 'N',
      source_url: 'https://donate.mozilla.org/',
      email: transaction.email
    }
  }, callback);
};
