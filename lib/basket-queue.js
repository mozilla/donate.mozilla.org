var AWS = require("aws-sdk");
var sqs = new AWS.SQS({
  maxRetries: 15,
  region: process.env.BASKET_QUEUE_REGION,
  accessKeyId: process.env.BASKET_ACCESS_KEY,
  secretAccessKey: process.env.BASKET_SECRET_ACCESS_KEY
});

var ZERO_DECIMAL_CURRENCIES = [
  'BIF',
  'CLP',
  'DJF',
  'GNF',
  'JPY',
  'KMF',
  'KRW',
  'MGA',
  'PYG',
  'RWF',
  'VND',
  'VUV',
  'XAF',
  'XOF',
  'XPF'
];

function zeroDecimalCurrencyFix(amount, currency) {
  if (ZERO_DECIMAL_CURRENCIES.indexOf(currency) === -1) {
    return amount / 100;
  }
  return amount;
}

function queue(data, callback) {
  if (typeof data !== "object") {
    return;
  }

  var wrapper = {
    timestamp: (new Date()).toISOString(),
    data: data
  };

  if (!process.env.BASKET_QUEUE_URL) {
    if (!process.env.BASKET_NO_LOG) {
      console.log("--- basket queue message ---");
      console.log(wrapper);
      console.log("-----------------------");
    }

    if (callback) {
      callback(null, {
        MD5OfMessageBody: "fake",
        MD5OfMessageAttributes: "fake",
        MessageId: "fake"
      });
    }
    return;
  }

  var body = JSON.stringify(wrapper);

  sqs.sendMessage({
    MessageBody: body,
    QueueUrl: process.env.BASKET_QUEUE_URL
  }, function(err, data) {
    if (callback) {
      callback(err, data);
    }
  });
}

module.exports = {
  zeroDecimalCurrencyFix,
  queue
};
