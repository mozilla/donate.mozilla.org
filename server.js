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
    path: '/stripe',
    handler: function(request, reply) {
      // obtain StripeToken
      var transaction = request.payload;

      var stripeToken = transaction.stripeToken;
      // create charge

      var charge = {
        // stripe works in cents
        amount: transaction.amount_other * 100,
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
    }
  }, {
    method: 'POST',
    path: '/signup',
    handler: function(request, reply) {
      var transaction = request.payload;
      httpRequest({
        url:'https://sendto.mozilla.org/page/signup/EOYFR2014-donor',
        method: "POST",
        form: transaction
      }, function(err, httpResponse, body) {
        if (err) {
          return console.error('signup failed:', err);
        }
        reply.redirect("/share");
      );
    }
  }, {
    method: 'GET',
    path: '/paypal-one-time-redirect',
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
          reply.redirect('/thank-you/?tx=' + bodyData.PAYMENTINFO_0_TRANSACTIONID + '&amt=' + data.PAYMENTREQUEST_0_AMT + '&cc=' + data.CURRENCYCODE);
        });
      });
    }
  }, {
    method: 'GET',
    path: '/paypal-recurring-redirect',
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
          // The below TRANSACTIONID is undefined.
          // I'm not sure how to get this yet for recurring payments.
          reply.redirect('/thank-you/?tx=' + bodyData.PAYMENTINFO_0_TRANSACTIONID + '&amt=' + data.AMT + '&cc=' + data.CURRENCYCODE);
        });
      });
    }
  }, {
    method: 'POST',
    path: '/paypal-one-time',
    handler: function(request, reply) {
      var transaction = request.payload;
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
          PAYMENTREQUEST_0_DESC: "Mozilla Foundation Donation",
          PAYMENTREQUEST_0_CURRENCYCODE: transaction.currency_code,
          LOCALECODE: transaction.lc,
          NOSHIPPING: "1",
          ALLOWNOTE: "0",
          cancelUrl: request.headers.referer,
          returnUrl: request.headers.referer + "paypal-one-time-redirect"
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
    path: '/paypal-recurring',
    handler: function(request, reply) {
      var transaction = request.payload;
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
          PAYMENTREQUEST_0_DESC: "Mozilla Foundation Recurring Donation",
          PAYMENTREQUEST_0_CURRENCYCODE: transaction.currency_code,
          L_BILLINGAGREEMENTDESCRIPTION0: "Mozilla Foundation Recurring Donation",
          L_BILLINGTYPE0: "RecurringPayments",
          LOCALECODE: transaction.lc,
          NOSHIPPING: "1",
          ALLOWNOTE: "0",
          cancelUrl: request.headers.referer,
          returnUrl: request.headers.referer + "paypal-recurring-redirect"
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
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});
