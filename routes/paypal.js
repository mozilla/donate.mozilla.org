var httpRequest = require('request');
var querystring = require("querystring");

function setupPaypal(transaction, recurring, callback) {
  var charge = {
    USER: process.env.PAYPAL_USER,
    PWD: process.env.PAYPAL_PWD,
    SIGNATURE: process.env.PAYPAL_SIGNATURE,
    METHOD: "SetExpressCheckout",
    VERSION: "106.0",
    PAYMENTREQUEST_0_PAYMENTACTION: "Sale",
    PAYMENTREQUEST_0_AMT: transaction.amount,
    PAYMENTREQUEST_0_DESC: transaction.item_name,
    PAYMENTREQUEST_0_CURRENCYCODE: transaction.currency,
    LOCALECODE: transaction.locale,
    NOSHIPPING: "1",
    ALLOWNOTE: "0",
    cancelUrl: transaction.cancelUrl,
    returnUrl: transaction.returnUrl
  };
  if (recurring) {
    charge.PAYMENTREQUEST_0_DESC = transaction.item_name;
    charge.L_BILLINGAGREEMENTDESCRIPTION0 = transaction.item_name;
    charge.L_BILLINGTYPE0 = "RecurringPayments";
  }
  httpRequest({
    url:'https://api-3t.sandbox.paypal.com/nvp',
    method: "POST",
    form: charge
  }, function(err, httpResponse, body) {
      if (err) {
        callback(err);
      } else {
        var data = querystring.parse(body);
        callback(null, data);
      }
  });
}

function doPaypal(transaction, recurring, callback) {
  httpRequest({
    url:'https://api-3t.sandbox.paypal.com/nvp',
    method: "POST",
    form: {
      USER: process.env.PAYPAL_USER,
      PWD: process.env.PAYPAL_PWD,
      SIGNATURE: process.env.PAYPAL_SIGNATURE,
      METHOD: "GetExpressCheckoutDetails",
      VERSION: "106.0",
      TOKEN: transaction.token
    }
  }, function(err, httpResponse, body) {
    if (err) {
      return callback(err);
    }
    var data = querystring.parse(body);
    var details = {
      USER: process.env.PAYPAL_USER,
      PWD: process.env.PAYPAL_PWD,
      SIGNATURE: process.env.PAYPAL_SIGNATURE,
      METHOD: "DoExpressCheckoutPayment",
      VERSION: "106.0",
      TOKEN: data.TOKEN,
      PAYERID: data.PAYERID,
    };
    if (recurring) {
      details.DESC = data.DESC;
      details.PROFILESTARTDATE = data.TIMESTAMP;
      details.BILLINGPERIOD = "Month";
      details.BILLINGFREQUENCY = "12";
      details.AMT = data.AMT;
      details.INITAMT = data.AMT;
      details.CURRENCYCODE = data.CURRENCYCODE;
    } else {
      details.PAYMENTREQUEST_0_AMT = data.PAYMENTREQUEST_0_AMT;
      details.PAYMENTREQUEST_0_CURRENCYCODE = data.CURRENCYCODE;
    }
    httpRequest({
      url:'https://api-3t.sandbox.paypal.com/nvp',
      method: "POST",
      form: details
    }, function(err, httpResponse, body) {
      if (err) {
        return callback(err);
      }
      var bodyData = querystring.parse(body);
      bodyData.CURRENCYCODE = data.CURRENCYCODE;
      if (recurring) {
        bodyData.AMT = data.AMT;
        bodyData.PAYERID = data.PAYERID;
      } else {
        bodyData.PAYMENTREQUEST_0_AMT = data.PAYMENTREQUEST_0_AMT;
      }
      callback(null, bodyData);
    });
  });
}

module.exports = {
  setupSingle: function(transaction, callback) {
    setupPaypal(transaction, false, callback);
  },
  setupRecurring: function(transaction, callback) {
    setupPaypal(transaction, true, callback);
  },
  doSingle: function(transaction, callback) {
    doPaypal(transaction, false, callback);
  },
  doRecurring: function(transaction, callback) {
    doPaypal(transaction, true, callback);
  }
};
