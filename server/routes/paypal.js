var Boom = require('boom');
var request = require('request');
var querystring = require('querystring');
var paypalLocales = require('../lib/intl-config.js').paypalLocales;
var accountSwitcher = require('../lib/paypal-account-switcher.js');

var httpRequest = request.defaults({
  timeout: 25000
});

function setupPaypal(transaction) {
  var accountType = accountSwitcher.getAccountType(transaction.amount, transaction.currency);
  var paypalCreds = accountSwitcher.creds[accountType];

  var frequency = transaction.frequency;
  var locale = transaction.locale;
  var appName = transaction.appName;
  var subscribed = transaction.subscribed

  var returnUrl = `${transaction.serverUri}/api/paypal-redirect/${frequency}/${locale}/${appName}/${accountType}/${subscribed}`;

  var cancelUrl = `${transaction.serverUri}/`;

  if (appName === 'thunderbird') {
    cancelUrl = `${cancelUrl}thunderbird/`;
  }

  var charge = {
    USER: paypalCreds.PAYPAL_USER,
    PWD: paypalCreds.PAYPAL_PWD,
    SIGNATURE: paypalCreds.PAYPAL_SIGNATURE,
    METHOD: 'SetExpressCheckout',
    VERSION: '106.0',
    PAYMENTREQUEST_0_PAYMENTACTION: 'Sale',
    PAYMENTREQUEST_0_AMT: transaction.amount,
    PAYMENTREQUEST_0_DESC: transaction.item_name,
    PAYMENTREQUEST_0_CURRENCYCODE: transaction.currency.toUpperCase(),
    LOCALECODE: paypalLocales[locale],
    NOSHIPPING: '1',
    ALLOWNOTE: '0',
    cancelUrl: cancelUrl,
    returnUrl: returnUrl
  };

  if (frequency === "monthly") {
    charge.PAYMENTREQUEST_0_DESC = transaction.item_name;
    charge.L_BILLINGAGREEMENTDESCRIPTION0 = transaction.item_name;
    charge.L_BILLINGTYPE0 = 'RecurringPayments';
  }
  return new Promise((resolve, reject) => {
    httpRequest({
      url: process.env.PAYPAL_API_ENDPOINT,
      method: 'POST',
      form: charge
    }, function(err, httpResponse, body) {
      if (err) {
        return reject(err);
      }

      resolve(querystring.parse(body));
    });
  });
}

function getCheckoutDetails(transaction, options) {
  var paypalCreds = accountSwitcher.creds[options.accountType];

  return new Promise((resolve, reject) => {
    httpRequest({
      url: process.env.PAYPAL_API_ENDPOINT,
      method: 'POST',
      form: {
        USER: paypalCreds.PAYPAL_USER,
        PWD: paypalCreds.PAYPAL_PWD,
        SIGNATURE: paypalCreds.PAYPAL_SIGNATURE,
        METHOD: 'GetExpressCheckoutDetails',
        VERSION: '106.0',
        TOKEN: transaction.token
      }
    }, function(err, httpResponse, body) {
      if (err) {
        return reject(err);
      }

      resolve(querystring.parse(body));
    });
  });
}

function doExpressCheckoutPayment(checkoutDetails, options) {
  var paypalCreds = accountSwitcher.creds[options.accountType];

  var recurring = options.recurring;
  var details = {
    USER: paypalCreds.PAYPAL_USER,
    PWD: paypalCreds.PAYPAL_PWD,
    SIGNATURE: paypalCreds.PAYPAL_SIGNATURE,
    VERSION: '106.0',
    TOKEN: checkoutDetails.TOKEN,
    PAYERID: checkoutDetails.PAYERID
  };
  if (recurring) {
    details.METHOD = 'CreateRecurringPaymentsProfile';
    details.DESC = checkoutDetails.DESC;
    details.MAXFAILEDPAYMENTS = '3';
    details.PROFILESTARTDATE = checkoutDetails.TIMESTAMP;
    details.BILLINGPERIOD = 'Month';
    details.BILLINGFREQUENCY = '1';
    details.AMT = checkoutDetails.AMT;
    details.CURRENCYCODE = checkoutDetails.CURRENCYCODE;
  } else {
    details.METHOD = 'DoExpressCheckoutPayment';
    details.PAYMENTREQUEST_0_AMT = checkoutDetails.PAYMENTREQUEST_0_AMT;
    details.PAYMENTREQUEST_0_CURRENCYCODE = checkoutDetails.CURRENCYCODE;
  }

  return new Promise((resolve, reject) => {
    httpRequest({
      url: process.env.PAYPAL_API_ENDPOINT,
      method: 'POST',
      form: details
    }, (err, httpResponse, body) => {
      if (err) {
        return reject(err);
      }

      let txn = querystring.parse(body);
      if (txn.ACK !== 'Success') {
        return reject(Boom.badImplementation(txn.L_SHORTMESSAGE0, {
          error_code: txn.L_ERRORCODE0,
          error_message: txn.L_LONGMESSAGE0
        }));
      }

      txn.CURRENCYCODE = checkoutDetails.CURRENCYCODE;
      if (recurring) {
        txn.AMT = checkoutDetails.AMT;
        txn.PAYERID = checkoutDetails.PAYERID;
      } else {
        txn.PAYMENTREQUEST_0_AMT = checkoutDetails.PAYMENTREQUEST_0_AMT;
      }
      resolve(txn);
    });
  });
}

let paypalRoutes = {
  setupCheckout: function(transaction) {
    return setupPaypal(transaction);
  },
  getCheckoutDetails: function(transaction, options) {
    return getCheckoutDetails(transaction, options);
  },
  completeCheckout: function(checkoutDetails, options) {
    return doExpressCheckoutPayment(checkoutDetails, options);
  }
};

module.exports = paypalRoutes;
