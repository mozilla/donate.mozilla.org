var httpRequest = require('request');
var stripe = require("./stripe");
var paypal = require("./paypal");

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
    var transaction = request.payload || {};
    if (transaction.recurring_acknowledge === '0') {
      stripe.single({
        amount: transaction.amount,
        stripeToken: transaction.stripeToken
      }, function(err, charge) {
        if (err) {
          console.log(err);
        } else {
          reply(charge);
          console.log('Successful charge sent to Stripe!');
        }
      });
    } else {
      stripe.recurring({
        amount: transaction.amount,
        stripeToken: transaction.stripeToken,
        email: transaction.email,
        metadata: transaction.metadata
      }, function(err, subscription) {
        if (err) {
          console.log(err);
        } else {
          reply(subscription);
          console.log('Successful subscription created!');
        }
      });
    }
  },
  "paypal-one-time": function(request, reply) {
    var transaction = request.payload || {};
    paypal.setupSingle({
      amount: transaction.amount,
      currency: transaction.currency_code,
      locale: transaction.lc,
      item_name: transaction.item_name,
      cancelUrl: request.headers.referer,
      returnUrl: request.server.info.uri + "/api/paypal-one-time-redirect"
    }, function(err, charge) {
      if (err) {
        return console.error('donation failed:', err);
      }
      reply.redirect("https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&useraction=commit&token=" + charge.TOKEN);
    });
  },
  "paypal-recurring": function(request, reply) {
    var transaction = request.payload || {};
    paypal.setupRecurring({
      amount: transaction.amount,
      currency: transaction.currency_code,
      locale: transaction.lc,
      item_name: transaction.item_name,
      cancelUrl: request.headers.referer,
      returnUrl: request.server.info.uri + "/api/paypal-recurring-redirect"
    }, function(err, subscription) {
      if (err) {
        return console.error('donation failed:', err);
      }
      reply.redirect("https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&useraction=commit&token=" + subscription.TOKEN);
    });
  },
  "paypal-one-time-redirect": function(request, reply) {
    paypal.doSingle({
      token: request.url.query.token
    }, function(err, charge) {
      if (err) {
        return console.error('donation failed:', err);
      }
      reply.redirect('/thank-you/?frequency=onetime&tx=' + charge.PAYMENTINFO_0_TRANSACTIONID + '&amt=' + charge.PAYMENTREQUEST_0_AMT + '&cc=' + charge.CURRENCYCODE);
    });
  },
  "paypal-recurring-redirect": function(request, reply) {
    paypal.doRecurring({
      token: request.url.query.token
    }, function(err, subscription) {
      if (err) {
        return console.error('donation failed:', err);
      }
      // Create unique tx id by combining PayerID and timestamp
      var stamp = Date.now() / 100;
      var txId = subscription.PAYERID + stamp;
      reply.redirect('/thank-you/?frequency=monthly&tx=' + txId + '&amt=' + subscription.AMT + '&cc=' + subscription.CURRENCYCODE);
    });
  }
};

module.exports = routes;
