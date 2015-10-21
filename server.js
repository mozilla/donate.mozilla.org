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
var Joi = require('joi');
var polyfillio = require('polyfill-service');
var PolyfillSet = require('./scripts/PolyfillSet.js');
var routes = require('./routes');

var server = new Hapi.Server();
server.connection({
  host: process.env.HOST,
  port: process.env.PORT,
  uri: process.env.APPLICATION_URI
});

var securityConfig = {
  hsts: process.env.HSTS_ENABLED === 'true' ? 15768000 : false,
  xframe: process.env.ENABLE_XFRAMEOPTIONS === 'true',
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
      payload: {
        maxBytes: 32000,
        allow: 'application/json'
      },
      security: securityConfig,
      validate: {
        payload: {
          locale: Joi.string().min(2).max(12).required(),
          email: Joi.string().email().required()
        }
      },
      response: {
        schema: false
      }
    }
  }, {
    method: 'POST',
    path: '/api/stripe',
    handler: routes.stripe,
    config: {
      payload: {
        maxBytes: 32000,
        allow: 'application/json'
      },
      security: securityConfig,
      validate: {
        payload: {
          currency: Joi.string().min(3).max(3).required(),
          amount: Joi.number().required(),
          frequency: Joi.string().min(6).max(7).required(),
          stripeToken: [Joi.string().required(), Joi.number().required()],
          email: Joi.string().email().required(),
          first: Joi.string().required(),
          last: Joi.string().required(),
          country: Joi.string().required(),
          address: Joi.string().required(),
          city: Joi.string().required(),
          code: Joi.string().required(),
          province: Joi.string(),
          locale: Joi.string().min(2).max(12).required()
        }
      },
      response: {
        schema: {
          id: Joi.string(),
          frequency: Joi.string().valid("monthly", "one-time"),
          currency: Joi.string().min(3).max(3),
          quantity: Joi.string(),
          amount: Joi.number()
        }
      }
    }
  }, {
    method: 'POST',
    path: '/api/paypal',
    handler: routes.paypal,
    config: {
      payload: {
        maxBytes: 32000,
        allow: 'application/json'
      },
      security: securityConfig,
      validate: {
        payload: {
          frequency: Joi.string().min(6).max(7).required(),
          description: Joi.string().required(),
          amount: Joi.number().required(),
          locale: Joi.string().min(2).max(12).required(),
          currency: Joi.string().min(1).max(4).required()
        }
      },
      response: {
        schema: {
          endpoint: Joi.string(),
          token: Joi.string()
        }
      }
    }
  }, {
    method: 'GET',
    path: '/api/paypal-redirect/{frequency}/{locale}/',
    handler: routes['paypal-redirect'],
    config: {
      security: securityConfig
    }
  }, {
    method: 'GET',
    path: '/api/polyfill.js',
    handler: function(request, reply) {
      var features = request.query.features;
      var flags = request.query.flags ? request.query.flags.split(',') : [];

      var polyfills = PolyfillSet.fromQueryParam(features || 'default', flags);
      var params = {
        features: polyfills.get(),
        minify: true
      };
      params.uaString = request.plugins.scooter.source;
      polyfillio.getPolyfillString(params).then(function(bundleString) {
        reply(bundleString).type('application/javascript');
      });
    },
    config: {
      security: securityConfig
    }
  }
]);

// This will catch all 404s and redirect them to root URL
// with preserving the pathname for client-side to handle.
server.ext('onPreResponse', function(request, reply) {
  if (request.response.output && request.response.output.statusCode === 404) {
    return reply.redirect('/?redirect=' + request.url.pathname);
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
          connectSrc: ['self', '206878104.log.optimizely.com', 'https://api.stripe.com', 'https://pontoon.mozilla.org'],
          fontSrc: ['self', 'https://fonts.gstatic.com', 'https://maxcdn.bootstrapcdn.com', 'https://pontoon.mozilla.org'],
          frameSrc: ['https://js.stripe.com', 'https://checkout.stripe.com', 'https://pontoon.mozilla.org'],
          imgSrc: ['self', 'https://www.google-analytics.com', 'https://q.stripe.com', 'https://pontoon.mozilla.org'],
          scriptSrc: ['self', 'https://cdn.optimizely.com',
            'https://www.google-analytics.com', 'https://ajax.googleapis.com',
            'https://js.stripe.com', 'https://checkout.stripe.com', 'https://pontoon.mozilla.org'],
          styleSrc: ['self', 'unsafe-inline', 'https://fonts.googleapis.com',
            'https://maxcdn.bootstrapcdn.com', 'https://pontoon.mozilla.org']
        }
      }
    ], function(err) {
      if (err) {
        throw err;
      }

      server.start(function() {
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

