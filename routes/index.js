var httpRequest = require('request');
var stripe = require('./stripe');
var paypal = require('./paypal');
var boom = require('boom');
var amountModifier = require('../scripts/amount-modifier');

var routes = {
  'signup': function(request, reply) {
    var url = process.env.SIGNUP;
    var transaction = request.payload || {};
    httpRequest.post({
      url: url,
      json: true,
      form: {
        format: 'html',
        lang: transaction.locale,
        newsletters: 'mozilla-foundation',
        trigger_welcome: 'N',
        source_url: 'https://donate.mozilla.org/',
        email: transaction.email
      }
    }, function(err, response, body) {
      if (err) {
        reply(boom.wrap(err, 500, 'Unable to complete Basket signup'));
      } else if (body.status === "error") {
        reply(boom.create(response.statusCode, body.desc));
      } else {
        reply().code(204);
      }
    });
  },
  'stripe': function(request, reply) {
    var transaction = request.payload || {};
    var currency = transaction.currency;
    var amount = amountModifier.stripe(transaction.amount, currency);
    if (transaction.frequency !== 'monthly') {
      stripe.single({
        amount: amount,
        currency: currency,
        stripeToken: transaction.stripeToken
      }, function(err, charge) {
        if (err) {
          reply({
            error: {
              code: err.code,
              rawType: err.rawType
            }
          });
          console.log('Stripe charge failed:', err);
        } else {
          reply({
            success: {
              frequency: "one-time",
              amount: charge.amount,
              currency: charge.currency,
              id: charge.id
            }
          });
          console.log('Stripe charge sent to Stripe!');
        }
      });
    } else {
      stripe.recurring({
        // Stripe has plans with set amounts, not custom amounts.
        // So to get a custom amount we have a plan set to 1 cent, and we supply the quantity.
        // https://support.stripe.com/questions/how-can-i-create-plans-that-dont-have-a-fixed-price
        quantity: amount,
        stripeToken: transaction.stripeToken,
        email: transaction.email,
        currency: currency,
        metadata: {
          firstname: transaction.first,
          lastname: transaction.last,
          country: transaction.country,
          address: transaction.address,
          city: transaction.city,
          zip: transaction.code,
          state: transaction.province,
          locale: transaction.locale
        }
      }, function(err, subscription) {
        if (err) {
          reply({
            error: {
              code: err.code,
              rawType: err.rawType
            }
          });
          console.log('Stripe subscription failed:', err);
        } else {
          reply({
            success: {
              frequency: "monthly",
              currency: subscription.plan.currency,
              quantity: subscription.quantity,
              id: subscription.id
            }
          });
          console.log('Stripe subscription created!');
        }
      });
    }
  },
  'paypal': function(request, reply) {
    var transaction = request.payload || {};
    var frequency = transaction.frequency || "";
    var currency = transaction.currency;
    var amount = amountModifier.paypal(transaction.amount, currency);
    var details = {
      amount: amount,
      currency: currency,
      locale: transaction.locale,
      item_name: transaction.description,
      cancelUrl: request.server.info.uri + '/',
      returnUrl: request.server.info.uri + '/api/paypal-redirect/' + frequency + '/' + transaction.locale + '/'
    };
    function callback(err, data) {
      if (err) {
        return console.error('donation failed:', err);
      }
      reply({
        endpoint: process.env.PAYPAL_ENDPOINT,
        token: data.TOKEN
      });
    }
    if (frequency !== 'monthly') {
      paypal.setupSingle(details, callback);
    } else {
      paypal.setupRecurring(details, callback);
    }
  },
  'paypal-redirect': function(request, reply) {
    var locale = request.params.locale || '';
    if (locale) {
      locale = '/' + locale;
    }
    var frequency = request.params.frequency || 'single';
    if (frequency !== 'monthly') {
      paypal.doSingle({
        token: request.url.query.token
      }, function(err, charge) {
        if (err) {
          return console.error('donation failed:', err);
        }
        reply.redirect(locale + '/thank-you/?frequency=' + frequency + '&tx=' + charge.PAYMENTINFO_0_TRANSACTIONID + '&amt=' + charge.PAYMENTREQUEST_0_AMT + '&cc=' + charge.CURRENCYCODE);
      });
    } else {
      paypal.doRecurring({
        token: request.url.query.token
      }, function(err, subscription) {
        if (err) {
          return console.error('donation failed:', err);
        }
        // Create unique tx id by combining PayerID and timestamp
        var stamp = Date.now() / 100;
        var txId = subscription.PAYERID + stamp;
        reply.redirect(locale + '/thank-you/?frequency=' + frequency + '&tx=' + txId + '&amt=' + subscription.AMT + '&cc=' + subscription.CURRENCYCODE);
      });
    }
  }
};

module.exports = routes;
