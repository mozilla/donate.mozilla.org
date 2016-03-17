var httpRequest = require('request');
var mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
var mailchimpListId = process.env.MAILCHIMP_LIST_ID;
var mailchimpAccountName = process.env.MAILCHIMP_ACCOUNT_NAME;

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

  var url = "https://" + dc + ".api.mailchimp.com/3.0/lists/" + mailchimpListId + "/members/";
  httpRequest.post({
    url: url,
    auth: {
      user: mailchimpAccountName,
      pass: apiKey
    },
    body: JSON.stringify({
      email_address: transaction.email,
      status: "pending",
      language: "en",
      merge_fields: {
        COUNTRY: transaction.country
      }
    })
  }, callback);
};
