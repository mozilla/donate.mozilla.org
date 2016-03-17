var httpRequest = require('request');
var mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
var mailchimpListId = process.env.MAILCHIMP_LIST_ID;

module.exports = function(transaction, callback) {
  callback = callback || function() {};
  if (!mailchimpApiKey) {
    console.warn("missing mailchimp API key");
    return;
  }
  // Mailchimp API keys store two parts in the key itself seperated via a dash.
  var splitMailchimpApiKey = mailchimpApiKey.split("-");
  var dc = splitMailchimpApiKey[1] || "";
  var apiKey = splitMailchimpApiKey[0] || "";

  var url = "https://" + dc + ".api.mailchimp.com/2.0/lists/subscribe/";
  httpRequest.post({
    url: url,
    json: true,
    form: {
      apikey: apiKey,
      id: mailchimpListId,
      email: {
        email: transaction.email
      },
      email_type: "text",
      merge_vars: {
        mc_language: transaction.locale,
        address: transaction.country
      }
    }
  }, function(err, res) {
console.log(err, res.body);
    callback(err, res);
  });
};
