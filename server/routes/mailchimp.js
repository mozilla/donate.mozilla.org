const httpRequest = require('request');
const mailchimpListId = process.env.MAILCHIMP_LIST_ID;
const user = process.env.MAILCHIMP_ACCOUNT_NAME;
const pass = process.env.MAILCHIMP_API_KEY;
const auth = { user, pass };

function sendRequest(body) {
  return new Promise((resolve, reject) => {
    // Mailchimp API keys store two parts in the key itself seperated via a dash.
    const splitMailchimpApiKey = pass.split("-");
    const dc = splitMailchimpApiKey[1] || "";
    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${mailchimpListId}/members/`;

    httpRequest.post({ url, auth, body }, (err, payload) => {
      if (err) {
        return reject(err);
      }

      resolve(payload);
    });
  });
}

module.exports = async function mailChimp(transaction) {
  if (!pass) {
    console.warn("missing mailchimp API key");
    return;
  }

  const body = JSON.stringify({
    email_address: transaction.email,
    status: "pending",
    language: "en",
    merge_fields: {
      COUNTRY: transaction.country
    }
  });

  return await sendRequest(body);
};
