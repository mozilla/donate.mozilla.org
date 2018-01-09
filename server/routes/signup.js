var hatchet = require('hatchet');
var url = process.env.SIGNUP;

var signupRoutes = function(transaction, callback) {
  var payload = {
    format: 'html',
    lang: transaction.locale,
    newsletters: 'mozilla-foundation',
    trigger_welcome: 'N',
    source_url: 'https://donate.mozilla.org/',
    email: transaction.email
  };

  hatchet.send("send_post_request", {
    url: url,
    json: true,
    form: payload
  }, (hatchet_error, response) => {
    callback(hatchet_error, payload);
  });
};

module.exports = signupRoutes;
