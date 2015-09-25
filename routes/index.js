var httpRequest = require('request');
var stripe = require('./stripe');
var paypal = require('./paypal');

var routes = {
  'signup': function(request, reply) {
    var url = process.env.SIGNUP;
    var transaction = request.payload || {};
    if(transaction.locale !== 'en-US') {
      url = url + '-' + transaction.locale;
    }
    httpRequest({
      url: url,
      method: 'POST',
      form: {
        'opt_in': '1',
        email: transaction.email
      }
    }, function(err) {
      if (err) {
        reply({
          error: err
        });
        console.error('signup failed:', err);
      } else {
        reply({
          success: true
        });
      }
    });
  },
  'stripe': function(request, reply) {
    var transaction = request.payload || {};
    if (transaction.frequency !== 'monthly') {
      stripe.single({
        amount: transaction.amount,
        currency: transaction.currency,
        stripeToken: transaction.stripeToken
      }, function(err, charge) {
        if (err) {
          reply({
            error: err
          });
          console.log('Stripe charge failed:', err);
        } else {
          reply({
            success: charge
          });
          console.log('Stripe charge sent to Stripe!');
        }
      });
    } else {
      stripe.recurring({
        amount: transaction.amount,
        stripeToken: transaction.stripeToken,
        email: transaction.email,
        metadata: {
          firstname: transaction.firstName,
          lastname: transaction.lastName,
          country: transaction.country,
          address: transaction.address,
          city: transaction.city,
          zip: transaction.zip,
          state: transaction.state,
          locale: transaction.locale
        }
      }, function(err, subscription) {
        if (err) {
          reply({
            error: err
          });
          console.log('Stripe subscription failed:', err);
        } else {
          reply({
            success: subscription
          });
          console.log('Stripe subscription created!');
        }
      });
    }
  },
  'paypal': function(request, reply) {
    var transaction = request.payload || {};
    var frequency = transaction.frequency || "";
    var details = {
      amount: transaction.amount,
      currency: transaction.currency,
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
