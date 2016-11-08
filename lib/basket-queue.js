var AWS = require("aws-sdk");
var sqs = new AWS.SQS({
  maxRetries: 15,
  region: process.env.BASKET_QUEUE_REGION
});

module.exports = {
  queue: function(data, callback) {
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
};