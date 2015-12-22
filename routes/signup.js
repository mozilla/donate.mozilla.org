var hatchet = require('hatchet');
var url = process.env.SIGNUP;

module.exports = function(transaction, callback) {
  var payload = {
    format: 'html',
    lang: transaction.locale,
    newsletters: transaction.newsletters,
    trigger_welcome: 'N',
    source_url: 'https://donate.mozilla.org/',
    email: transaction.email,
    country: transaction.country
  };

  hatchet.send("send_post_request", {
    url: url,
    json: true,
    form: payload
  }, (hatchet_error, response) => {
    callback(hatchet_error, payload);
  });
};
