require('habitat').load();
var Path = require('path');

var Hapi = require('hapi');
var Good = require('good');
var httpRequest = require('request');
var querystring = require("querystring");

var server = new Hapi.Server();
server.connection({
  host: process.env.HOST,
  port: process.env.PORT
});

var stripeKeys = {
  publishableKey: process.env.STRIPE_PUBLIC_KEY,
  // This is just a test key right now, nothing secret about it.
  secretKey: process.env.STRIPE_SECRET_KEY
};

var stripe = require('stripe')(stripeKeys.secretKey);

server.route([
  {
     method: 'GET',
     path: '/{params*}',
     handler: {
       directory: {
         path: Path.join(__dirname, 'public')
       }
     }
  }, {
    method: 'POST',
    path: '/api/stripe',
    handler: function(request, reply) {
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
    }
  }, {
    method: 'POST',
    path: '/api/signup',
    handler: function(request, reply) {
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
    }
  }, {
    method: 'GET',
    path: '/api/paypal-one-time-redirect',
    handler: function(request, reply) {
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
    }
  }, {
    method: 'GET',
    path: '/api/paypal-recurring-redirect',
    handler: function(request, reply) {
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
  }, {
    method: 'POST',
    path: '/api/paypal-one-time',
    handler: function(request, reply) {
      var transaction = request.payload || {};
      httpRequest({
        url:'https://api-3t.sandbox.paypal.com/nvp',
        method: "POST",
        form: {
          USER: process.env.PAYPAL_USER,
          PWD: process.env.PAYPAL_PWD,
          SIGNATURE: process.env.PAYPAL_SIGNATURE,
          METHOD: "SetExpressCheckout",
          VERSION: "106.0",
          PAYMENTREQUEST_0_PAYMENTACTION: "Sale",
          PAYMENTREQUEST_0_AMT: transaction.amount,
          PAYMENTREQUEST_0_DESC: transaction.item_name,
          PAYMENTREQUEST_0_CURRENCYCODE: transaction.currency_code,
          LOCALECODE: transaction.lc,
          NOSHIPPING: "1",
          ALLOWNOTE: "0",
          cancelUrl: request.headers.referer,
          returnUrl: request.headers.referer + "api/paypal-one-time-redirect"
        }
      }, function(err, httpResponse, body) {
        if (err) {
          return console.error('donation failed:', err);
        }
        var data = querystring.parse(body);
        reply.redirect("https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&useraction=commit&token=" + data.TOKEN);
      });
    }
  }, {
    method: 'POST',
    path: '/api/paypal-recurring',
    handler: function(request, reply) {
      var transaction = request.payload || {};
      httpRequest({
        url:'https://api-3t.sandbox.paypal.com/nvp',
        method: "POST",
        form: {
          USER: process.env.PAYPAL_USER,
          PWD: process.env.PAYPAL_PWD,
          SIGNATURE: process.env.PAYPAL_SIGNATURE,
          METHOD: "SetExpressCheckout",
          VERSION: "106.0",
          PAYMENTREQUEST_0_PAYMENTACTION: "Sale",
          PAYMENTREQUEST_0_AMT: transaction.amount,
          PAYMENTREQUEST_0_DESC: transaction.item_name,
          PAYMENTREQUEST_0_CURRENCYCODE: transaction.currency_code,
          L_BILLINGAGREEMENTDESCRIPTION0: transaction.item_name,
          L_BILLINGTYPE0: "RecurringPayments",
          LOCALECODE: transaction.lc,
          NOSHIPPING: "1",
          ALLOWNOTE: "0",
          cancelUrl: request.headers.referer,
          returnUrl: request.headers.referer + "api/paypal-recurring-redirect"
        }
      }, function(err, httpResponse, body) {
        if (err) {
          return console.error('donation failed:', err);
        }
        var data = querystring.parse(body);
        reply.redirect("https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&useraction=commit&token=" + data.TOKEN);
      });
    }
  }
]);

module.exports = {
  start: function(done) {
    server.register({
      register: Good,
      options: {
        reporters: [{
          reporter: require('good-console'),
          events: {
            response: '*',
            log: '*'
          }
        }]
      }
    }, function (err) {
      if (err) {
        throw err;
      }

      server.start(function () {
        server.log('info', 'Running server at: ' + server.info.uri);
        if (done) {
          done();
        }
      });
    });
  },
  stop: function(done) {
    server.stop(function() {
      server.log('info', 'Stopped server at: ' + server.info.uri);
      if (done) {
        done();
      }
    });
  }
};
