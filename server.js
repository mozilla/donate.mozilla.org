require('habitat').load();

/*eslint-disable no-unused-vars*/
var newrelic;
/*eslint-disable no-unused-vars*/
if (process.env.NEW_RELIC_ENABLED === 'true') {
  newrelic = require('newrelic');
} else {
  newrelic = {};
}

var Path = require('path');
var Hapi = require('hapi');

var routes = require('./routes');

var server = new Hapi.Server();
server.connection({
  host: process.env.HOST,
  port: process.env.PORT,
  uri: process.env.APPLICATION_URI
});

var securityConfig = {
  hsts: process.env.HSTS_ENABLED === 'true' ? 15768000 : false,
  xframe: true,
  xss: true,
  noOpen: true,
  noSniff: true
};

server.route([
  {
    method: 'GET',
    path: '/{params*}',
    handler: {
      directory: {
        path: Path.join(__dirname, 'public')
      }
    },
    config: {
      security: securityConfig
    }
  }, {
    method: 'POST',
    path: '/api/signup',
    handler: routes.signup,
    config: {
      security: securityConfig
    }
  }, {
    method: 'POST',
    path: '/api/stripe',
    handler: routes.stripe,
    config: {
      security: securityConfig
    }
  }, {
    method: 'POST',
    path: '/api/paypal',
    handler: routes.paypal,
    config: {
      security: securityConfig
    }
  }, {
    method: 'GET',
    path: '/api/paypal-one-time-redirect',
    handler: routes['paypal-one-time-redirect'],
    config: {
      security: securityConfig
    }
  }, {
    method: 'GET',
    path: '/api/paypal-recurring-redirect',
    handler: routes['paypal-recurring-redirect'],
    config: {
      security: securityConfig
    }
  }
]);

// This will catch all 404s and redirect them to root URL
// with preserving the pathname for client-side to handle.
server.ext('onPreResponse', function(request, reply) {
  if(request.response.output && request.response.output.statusCode === 404) {
    return reply.redirect('/?pathname=' + request.url.pathname);
  }
  return reply.continue();
});

module.exports = {
  start: function(done) {
    server.register([
      {
        register: require('good'),
        options: {
          reporters: [{
            reporter: require('good-console'),
            events: {
              response: '*',
              log: '*'
            }
          }]
        }
      },
      {
        register: require('scooter')
      },
      {
        register: require('blankie'),
        options: {
          connectSrc: ['self', '206878104.log.optimizely.com', 'https://api.stripe.com'],
          fontSrc: ['self', 'https://fonts.gstatic.com', 'https://maxcdn.bootstrapcdn.com'],
          frameSrc: ['https://js.stripe.com'],
          imgSrc: ['self', 'https://www.google-analytics.com'],
          scriptSrc: ['self', 'https://cdn.optimizely.com',
            'https://www.google-analytics.com', 'https://ajax.googleapis.com',
            'https://js.stripe.com'],
          styleSrc: ['self', 'unsafe-inline', 'https://fonts.googleapis.com',
            'https://maxcdn.bootstrapcdn.com']
        }
      }
    ], function (err) {
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

