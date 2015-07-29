require('habitat').load();
var Path = require('path');

var Hapi = require('hapi');
var Good = require('good');
var httpRequest = require('request');

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
