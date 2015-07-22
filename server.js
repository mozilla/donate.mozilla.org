require('habitat').load();
var Path = require('path');

var Hapi = require('hapi');
var Good = require('good');
var httpRequest = require( "request" );

var server = new Hapi.Server();
server.connection({
  host: process.env.HOST,
  port: process.env.PORT
});

var stripeKeys = {
  publishableKey: 'pk_test_BZ0QTIwe7BVAk1ZDxOgWZ9Z6',
  // This is just a test key right now, nothing secret about it.
  secretKey: 'sk_test_HbsdaR1Bn5I84vdezKa9VcvA'
}

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
    path: '/paypal-ipn',
    handler: function(request, reply) {
      // Let PayPal know we received it.
      reply();
      var transaction = request.payload;
      transaction.cmd = "_notify-validate";
      httpRequest({
        url: "https://www.sandbox.paypal.com/cgi-bin/webscr",
        method: "POST",
        form: transaction
      }, function(err, httpResponse, body) {
        if (err) {
          return console.error('donation failed:', err);
        }
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
