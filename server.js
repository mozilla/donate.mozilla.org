require('habitat').load();

/*eslint-disable no-unused-vars*/
var newrelic;
/*eslint-disable no-unused-vars*/
if (process.env.NEW_RELIC_ENABLED === 'true') {
  newrelic = require('newrelic');
} else {
  newrelic = {};
}

var Boom = require('boom');
var Path = require('path');
var Hapi = require('hapi');
var Hoek = require('hoek');
var Joi = require('joi');
var polyfillio = require('polyfill-service');
var PolyfillSet = require('./scripts/PolyfillSet.js');
var exchangeRates = require('./assets/exchange-rates/latest.json');
var routes = require('./routes');
var goodConfig = {
  reporter: require('good-console-logfmt')
};
var currencyFor = require('./lib/currency-for.js');

if (process.env.NPM_CONFIG_PRODUCTION === 'true') {
  goodConfig.events = {
    error: '*',
    request: [
      'signup',
      'stripe',
      'paypal'
    ]
  };
} else {
  goodConfig.events = {
    response: '*',
    log: '*',
    request: [
      'signup',
      'stripe',
      'paypal'
    ]
  };
}

module.exports = function(options) {
  var serverOptions = Hoek.applyToDefaults({
    connections: {
      routes: {
        security: {
          hsts: {
            maxAge: 15768000,
            includeSubDomains: true,
            preload: true
          },
          xframe: process.env.ENABLE_XFRAMEOPTIONS === 'true',
          xss: true,
          noOpen: true,
          noSniff: true
        }
      }
    }
  }, options);

  var server = new Hapi.Server(serverOptions);

  server.connection({
    host: process.env.HOST,
    port: process.env.PORT,
    uri: process.env.APPLICATION_URI
  });

  server.register(require("hapi-auth-bearer-token"), function(err) {});

  server.auth.strategy("stripe", "bearer-access-token", {
    validateFunc: function(token, callback) {
      // this = request
      callback(null, token === process.env.STRIPE_WEBHOOK_SECRET, { token: token });
    }
  });

  server.route([
    {
      method: 'POST',
      path: '/api/signup',
      handler: routes.signup,
      config: {
        payload: {
          maxBytes: 32000,
          allow: 'application/json'
        },
        validate: {
          payload: {
            locale: Joi.string().min(2).max(12).required(),
            email: Joi.string().email().required(),
            country: Joi.string().allow('')
          }
        },
        response: {
          schema: {
            format: Joi.any().valid('html').required(),
            lang: Joi.string().min(2).max(12).required(),
            newsletters: Joi.string().required(),
            trigger_welcome: Joi.any().valid('N').required(),
            source_url: Joi.any().valid('https://donate.mozilla.org/').required(),
            email: Joi.string().email().required(),
            country: Joi.string().allow('')
          }
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
        validate: {
          payload: {
            currency: Joi.any().valid(currencyFor.stripe).required(),
            amount: Joi.number().required(),
            frequency: Joi.string().min(6).max(7).required(),
            stripeToken: [Joi.string().required(), Joi.number().required()],
            description: Joi.string().required(),
            email: Joi.string().email().required(),
            first: Joi.string().required(),
            last: Joi.string().required(),
            country: Joi.string().required(),
            address: Joi.string().allow(''),
            city: Joi.string().allow(''),
            code: Joi.string().required(),
            province: Joi.string().allow(''),
            locale: Joi.string().min(2).max(12).required(),
            signup: Joi.boolean()
          }
        },
        response: {
          schema: {
            id: Joi.string(),
            frequency: Joi.string().valid("monthly", "one-time"),
            currency: Joi.any().valid(currencyFor.stripe).required(),
            quantity: Joi.number(),
            amount: Joi.number(),
            signup: Joi.boolean(),
            email: Joi.string().email().allow(''),
            country: Joi.string().allow('')
          }
        }
      }
    }, {
      method: 'POST',
      path: '/api/stripe-checkout',
      handler: routes.stripe,
      config: {
        payload: {
          maxBytes: 32000,
          allow: 'application/json'
        },
        validate: {
          payload: {
            currency: Joi.any().valid(currencyFor.stripe).required(),
            amount: Joi.number().required(),
            frequency: Joi.string().min(6).max(7).required(),
            stripeToken: [Joi.string().required(), Joi.number().required()],
            locale: Joi.string().min(2).max(12).required(),
            email: Joi.string().email().required(),
            first: Joi.string(),
            country: Joi.string(),
            address: Joi.string().allow(''),
            city: Joi.string().allow(''),
            code: Joi.string().required(),
            description: Joi.string().required()
          }
        },
        response: {
          schema: {
            id: Joi.string(),
            frequency: Joi.string().valid("monthly", "one-time"),
            currency: Joi.any().valid(currencyFor.stripe).required(),
            quantity: Joi.number(),
            amount: Joi.number(),
            signup: Joi.boolean(),
            email: Joi.string().email().allow(''),
            country: Joi.string().allow('')
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
        validate: {
          payload: {
            frequency: Joi.string().min(6).max(7).required(),
            description: Joi.string().required(),
            amount: Joi.number().required(),
            locale: Joi.string().min(2).max(12).required(),
            currency: Joi.any().valid(currencyFor.paypal).required()
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
      handler: routes['paypal-redirect']
    }, {
      method: 'GET',
      path: '/api/polyfill.js',
      handler: function(request, reply) {
        var features = request.query.features;
        var flags = request.query.flags ? request.query.flags.split(',') : [];

        var polyfills = PolyfillSet.fromQueryParam(features || 'default', flags);
        var params = {
          features: polyfills.get(),
          minify: true,
          unknown: 'polyfill'
        };
        params.uaString = request.plugins.scooter.source;
        polyfillio.getPolyfillString(params).then(function(bundleString) {
          reply(bundleString).type('application/javascript; charset=utf-8').vary('User-Agent');
        });
      },
      config: {
        cache: {
          expiresIn: 7 * 24 * 60 * 60 * 1000, // one week
          privacy: 'public'
        }
      }
    }, {
      'method': 'GET',
      path: '/api/exchange-rates/latest.json',
      handler: function(request, reply) {
        reply(exchangeRates).type('application/json; charset=utf-8');
      },
      config: {
        cache: {
          expiresIn: 300 * 1000,
          privacy: 'public'
        }
      }
    }, {
      method: "POST",
      path: "/stripe/dispute-callback",
      config: {
        auth: "stripe"
      },
      handler: routes['stripe-dispute']
    }
  ]);

  var nonASCIICharacters = /[^\x00-\x7F]/g;

  // This will catch all 404s and redirect them to root URL
  // with preserving the pathname for client-side to handle.
  server.ext('onPreResponse', function(request, reply) {
    if (request.response.output && request.response.output.statusCode === 404) {
      if (nonASCIICharacters.test(request.path)) {
        return reply(
          new Boom.badRequest('Location cannot contain or convert into non-ascii characters', { path: request.path })
        );
      }

      return reply.redirect('/?redirect=' + request.url.pathname);
    }
    return reply.continue();
  });

  server.register([
    {
      register: require('inert')
    },
    {
      register: require('good'),
      options: {
        reporters: [goodConfig]
      }
    },
    {
      register: require('scooter')
    },
    {
      register: require('blankie'),
      options: {
        connectSrc: ['self', 'https://checkout.stripe.com', '206878104.log.optimizely.com', 'https://api.stripe.com', 'https://pontoon.mozilla.org'],
        fontSrc: ['self', 'https://fonts.gstatic.com', 'https://maxcdn.bootstrapcdn.com', 'https://pontoon.mozilla.org'],
        frameSrc: ['https://js.stripe.com', 'https://checkout.stripe.com', 'https://pontoon.mozilla.org',
                    'https://app.optimizely.com', 'https://www.surveygizmo.com'],
        imgSrc: ['self', 'https://www.google-analytics.com', 'https://q.stripe.com', 'https://pontoon.mozilla.org',
          'https://cdn.optimizely.com'],
        scriptSrc: ['self', 'unsafe-inline', 'unsafe-eval', 'https://cdn.optimizely.com', 'https://app.optimizely.com',
          'https://optimizely.s3.amazonaws.com', 'https://www.google-analytics.com', 'https://ajax.googleapis.com',
          'https://js.stripe.com', 'https://checkout.stripe.com', 'https://pontoon.mozilla.org'],
        styleSrc: ['self', 'unsafe-inline', 'https://fonts.googleapis.com',
          'https://maxcdn.bootstrapcdn.com', 'https://pontoon.mozilla.org']
      }
    }
  ], function(err) {
    if (err) {
      throw err;
    }

    // We have these routes specifically for production where it's possible that
    // a CDN index.html may refer to an outdated CSS/JS file that doesn't exist
    server.route(require('./lib/hashed-file-routes')());

    server.route([{
      method: 'GET',
      path: '/{params*}',
      handler: {
        directory: {
          path: Path.join(__dirname, 'public')
        }
      },
      config: {
        cache: {
          expiresIn: 1000 * 60 * 5,
          privacy: 'public'
        }
      }
    }, {
      method: 'GET',
      path: '/assets/{params*}',
      handler: {
        directory: {
          path: Path.join(__dirname, 'assets')
        }
      },
      config: {
        cache: {
          expiresIn: 7 * 24 * 60 * 60 * 1000, // one week
          privacy: 'public'
        }
      }
    }]);
  });

  return server;
};
