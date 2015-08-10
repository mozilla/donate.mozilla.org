var httpRequest = require('request');
var querystring = require("querystring");

var stripeKeys = {
  publishableKey: process.env.STRIPE_PUBLIC_KEY,
  // This is just a test key right now, nothing secret about it.
  secretKey: process.env.STRIPE_SECRET_KEY
};

var stripe = require('stripe')(stripeKeys.secretKey);

var routes = {
  "signup": function(request, reply) {
    var transaction = request.payload || {};
    httpRequest({
      url: 'http://donate-mozilla.herokuapp.com/thank-you/',
      method: "POST",
      form: transaction
    }, function(err, httpResponse, body) {
      if (err) {
        return console.error('signup failed:', err);
      }
      reply.redirect("/share");
    });
  },
  "stripe": function(request, reply) {
    // obtain StripeToken
    var transaction = request.payload || {};

    var stripeToken = transaction.stripeToken;
    // create charge

    if (transaction.recurring_acknowledge === '0') {
      var charge = {
        // stripe works in cents
        amount: transaction.amount * 100,
        currency: 'USD',
        card: stripeToken
      };
      stripe.charges.create(charge,
        function(err, charge) {
          if (err) {
            console.log(err);
          } else {
            reply(charge);
            console.log('Successful charge sent to Stripe!');
          }
        }
      );
    } else {
      stripe.customers.create({
        email: transaction.email,
        metadata: transaction.metadata
      }, function(err, customer) {
        if (err) {
          console.log(err);
        } else {
          var amt = parseFloat(transaction.amount, 10);
          var subscription = {
            plan: "base",
            quantity: amt / 0.01,
            source: transaction.stripeToken
          };
          stripe.customers.createSubscription(customer.id, subscription,
            function(err, subscription) {
              if (err) {
                console.log(err);
              } else {
                reply(subscription);
                console.log('Successful subscription created!');
              }
            }
          );
        }
      });
    }
  },
  "paypal": function(request, reply) {
    var payload = request.payload || {};
    var transaction = {
      USER: process.env.PAYPAL_USER,
      PWD: process.env.PAYPAL_PWD,
      SIGNATURE: process.env.PAYPAL_SIGNATURE,
      METHOD: "SetExpressCheckout",
      VERSION: "106.0",
      PAYMENTREQUEST_0_PAYMENTACTION: "Sale",
      PAYMENTREQUEST_0_AMT: payload.donation_amount,
      PAYMENTREQUEST_0_DESC: "Mozilla Foundation Donation",
      PAYMENTREQUEST_0_CURRENCYCODE: payload.paypal_currency_code,
      LOCALECODE: payload.paypal_locale_code,
      NOSHIPPING: "1",
      ALLOWNOTE: "0",
      cancelUrl: request.headers.referer,
      returnUrl: request.server.info.uri + "/paypal-one-time-redirect"
    };
    if (payload.recurring_acknowledge === "1") {
      transaction.PAYMENTREQUEST_0_DESC = "Mozilla Foundation Monthly Donation";
      transaction.L_BILLINGAGREEMENTDESCRIPTION0 = "Mozilla Foundation Monthly Donation";
      transaction.L_BILLINGTYPE0 = "RecurringPayments";
      transaction.returnUrl = request.server.info.uri + "/paypal-recurring-redirect";
    }
    httpRequest({
      url:'https://api-3t.sandbox.paypal.com/nvp',
      method: "POST",
      form: transaction
    }, function(err, httpResponse, body) {
      if (err) {
        return console.error('donation failed:', err);
      }
      var data = querystring.parse(body);
      reply.redirect("https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&useraction=commit&token=" + data.TOKEN);
    });
  },
  "paypal-one-time-redirect": function(request, reply) {
    httpRequest({
      url:'https://api-3t.sandbox.paypal.com/nvp',
      method: "POST",
      form: {
        USER: process.env.PAYPAL_USER,
        PWD: process.env.PAYPAL_PWD,
        SIGNATURE: process.env.PAYPAL_SIGNATURE,
        METHOD: "GetExpressCheckoutDetails",
        VERSION: "106.0",
        TOKEN: request.url.query.token
      }
    }, function(err, httpResponse, body) {
      if (err) {
        return console.error('donation failed:', err);
      }
      var data = querystring.parse(body);
      httpRequest({
        url:'https://api-3t.sandbox.paypal.com/nvp',
        method: "POST",
        form: {
          USER: process.env.PAYPAL_USER,
          PWD: process.env.PAYPAL_PWD,
          SIGNATURE: process.env.PAYPAL_SIGNATURE,
          METHOD: "DoExpressCheckoutPayment",
          VERSION: "106.0",
          TOKEN: data.TOKEN,
          PAYERID: data.PAYERID,
          PAYMENTREQUEST_0_AMT: data.PAYMENTREQUEST_0_AMT,
          PAYMENTREQUEST_0_CURRENCYCODE: data.CURRENCYCODE
        }
      }, function(err, httpResponse, body) {
        if (err) {
          return console.error('donation failed:', err);
        }
        var bodyData = querystring.parse(body);
        reply.redirect('/thank-you/?frequency=onetime&tx=' + bodyData.PAYMENTINFO_0_TRANSACTIONID + '&amt=' + data.PAYMENTREQUEST_0_AMT + '&cc=' + data.CURRENCYCODE);
      });
    });
  },
  "paypal-recurring-redirect": function(request, reply) {
    httpRequest({
      url:'https://api-3t.sandbox.paypal.com/nvp',
      method: "POST",
      form: {
        USER: process.env.PAYPAL_USER,
        PWD: process.env.PAYPAL_PWD,
        SIGNATURE: process.env.PAYPAL_SIGNATURE,
        METHOD: "GetExpressCheckoutDetails",
        VERSION: "106.0",
        TOKEN: request.url.query.token
      }
    }, function(err, httpResponse, body) {
      if (err) {
        return console.error('donation failed:', err);
      }
      var data = querystring.parse(body);
      httpRequest({
        url:'https://api-3t.sandbox.paypal.com/nvp',
        method: "POST",
        form: {
          USER: process.env.PAYPAL_USER,
          PWD: process.env.PAYPAL_PWD,
          SIGNATURE: process.env.PAYPAL_SIGNATURE,
          METHOD: "CreateRecurringPaymentsProfile",
          VERSION: "106.0",
          TOKEN: data.TOKEN,
          PAYERID: data.PAYERID,
          DESC: data.DESC,
          PROFILESTARTDATE: data.TIMESTAMP,
          BILLINGPERIOD: "Month",
          BILLINGFREQUENCY: "12",
          AMT: data.AMT,
          INITAMT: data.AMT,
          CURRENCYCODE: data.CURRENCYCODE
        }
      }, function(err, httpResponse, body) {
        if (err) {
          return console.error('donation failed:', err);
        }
        var bodyData = querystring.parse(body);
        // Create unique tx id by combining PayerID and timestamp
        var stamp = Date.now() / 100;
        var txId = data.PAYERID + stamp;
        reply.redirect('/thank-you/?frequency=monthly&tx=' + txId + '&amt=' + data.AMT + '&cc=' + data.CURRENCYCODE);
      });
    });
  }
};

module.exports = routes;
