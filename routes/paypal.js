var request = require('request');
var querystring = require('querystring');
var paypalLocales = require('../intl-config.js').paypalLocales;

var httpRequest = request.defaults({
  timeout: 25000
});

function setupPaypal(transaction, recurring, callback) {
  var charge = {
    USER: process.env.PAYPAL_USER,
    PWD: process.env.PAYPAL_PWD,
    SIGNATURE: process.env.PAYPAL_SIGNATURE,
    METHOD: 'SetExpressCheckout',
    VERSION: '106.0',
    PAYMENTREQUEST_0_PAYMENTACTION: 'Sale',
    PAYMENTREQUEST_0_AMT: transaction.amount,
    PAYMENTREQUEST_0_DESC: transaction.item_name,
    PAYMENTREQUEST_0_CURRENCYCODE: transaction.currency.toUpperCase(),
    LOCALECODE: paypalLocales[transaction.locale],
    NOSHIPPING: '1',
    ALLOWNOTE: '0',
    cancelUrl: transaction.cancelUrl,
    returnUrl: transaction.returnUrl
  };
  if (recurring) {
    charge.PAYMENTREQUEST_0_DESC = transaction.item_name;
    charge.L_BILLINGAGREEMENTDESCRIPTION0 = transaction.item_name;
    charge.L_BILLINGTYPE0 = 'RecurringPayments';
  }
  var paypalRequestSaleStart = Date.now();
  httpRequest({
    url: process.env.PAYPAL_API_ENDPOINT,
    method: 'POST',
    form: charge
  }, function(err, httpResponse, body) {
    var paypal_request_sale_service = Date.now() - paypalRequestSaleStart;
    if (err) {
      callback(err, {
        paypal_request_sale_service,
        response: querystring.parse(body)
      });
    } else {
      callback(null, {
        paypal_request_sale_service,
        response: querystring.parse(body)
      });
    }
  });
}

function getCheckoutDetails(transaction, recurring, callback) {
  var paypalCheckoutDetailsStart = Date.now();
  httpRequest({
    url: process.env.PAYPAL_API_ENDPOINT,
    method: 'POST',
    form: {
      USER: process.env.PAYPAL_USER,
      PWD: process.env.PAYPAL_PWD,
      SIGNATURE: process.env.PAYPAL_SIGNATURE,
      METHOD: 'GetExpressCheckoutDetails',
      VERSION: '106.0',
      TOKEN: transaction.token
    }
  }, function(err, httpResponse, body) {
    var paypal_checkout_details_service = Date.now() - paypalCheckoutDetailsStart;
    var data = querystring.parse(body);
    return callback(err, {
      paypal_checkout_details_service,
      response: data
    });
  });
}

function doExpressCheckoutPayment(checkoutDetails, recurring, callback) {
  var paypalCheckoutPaymentStart = Date.now();
  var details = {
    USER: process.env.PAYPAL_USER,
    PWD: process.env.PAYPAL_PWD,
    SIGNATURE: process.env.PAYPAL_SIGNATURE,
    METHOD: 'DoExpressCheckoutPayment',
    VERSION: '106.0',
    TOKEN: checkoutDetails.TOKEN,
    PAYERID: checkoutDetails.PAYERID
  };
  if (recurring) {
    details.DESC = checkoutDetails.DESC;
    details.PROFILESTARTDATE = checkoutDetails.TIMESTAMP;
    details.BILLINGPERIOD = 'Month';
    details.BILLINGFREQUENCY = '12';
    details.AMT = checkoutDetails.AMT;
    details.INITAMT = checkoutDetails.AMT;
    details.CURRENCYCODE = checkoutDetails.CURRENCYCODE;
  } else {
    details.PAYMENTREQUEST_0_AMT = checkoutDetails.PAYMENTREQUEST_0_AMT;
    details.PAYMENTREQUEST_0_CURRENCYCODE = checkoutDetails.CURRENCYCODE;
  }
  httpRequest({
    url: process.env.PAYPAL_API_ENDPOINT,
    method: 'POST',
    form: details
  }, function(err, httpResponse, body) {
    var paypal_checkout_payment_service = Date.now() - paypalCheckoutPaymentStart;
    if (err) {
      return callback(err, {
        paypal_checkout_payment_service
      });
    }
    var txn = querystring.parse(body);
    txn.CURRENCYCODE = checkoutDetails.CURRENCYCODE;
    if (recurring) {
      txn.AMT = checkoutDetails.AMT;
      txn.PAYERID = checkoutDetails.PAYERID;
    } else {
      txn.PAYMENTREQUEST_0_AMT = checkoutDetails.PAYMENTREQUEST_0_AMT;
    }
    callback(null, {
      paypal_checkout_payment_service,
      txn
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
  getSingleCheckoutDetails: function(transaction, callback) {
    getCheckoutDetails(transaction, false, callback);
  },
  getRecurringCheckoutDetails: function(transaction, callback) {
    getCheckoutDetails(transaction, true, callback);
  },
  completeSingleCheckout: function(checkoutDetails, callback) {
    doExpressCheckoutPayment(checkoutDetails, false, callback);
  },
  completeRecurringCheckout: function(checkoutDetails, callback) {
    doExpressCheckoutPayment(checkoutDetails, true, callback);
  }
};
