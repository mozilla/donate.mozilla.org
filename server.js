require('habitat').load();

var Path = require('path');
var Hapi = require('hapi');
var Joi = require('joi');

var polyfillio = require('polyfill-service');
var PolyfillSet = require('./scripts/PolyfillSet.js');
var getLocale = require('./dist/lib/get-locale.js');

var locales = {};
Object.keys(require('./public/locales.json')).forEach(function(locale) {
  locales[locale.toLowerCase()] = locale;
});

var exchangeRates = require('./assets/exchange-rates/latest.json');
var routes = require('./routes');
var goodConfig = {
  reporter: require('good-console-logfmt')
};
var currencyFor = require('./lib/currency-for.js');
var reactRouted = require('./dist/lib/react-server-route.js')(locales);

if (process.env.NPM_CONFIG_PRODUCTION === 'true') {
  goodConfig.events = {
    error: '*',
    request: [
      'signup',
      'mailchimp',
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
      'mailchimp',
      'stripe',
      'paypal'
    ]
  };
}

module.exports = function(options) {
  options = options || {};
  var serverOptions = {
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
    },
    useDomains: !!options.useDomains
  };

  var server = new Hapi.Server(serverOptions);

  server.connection({
    host: process.env.HOST,
    port: process.env.PORT,
    uri: process.env.APPLICATION_URI
  });

  server.register(require("hapi-auth-bearer-token"), function(err) {
    if (err) {
      throw err;
    }
  });

  server.auth.strategy("stripe", "bearer-access-token", {
    validateFunc: function(token, callback) {
      callback(null, token === process.env.STRIPE_WEBHOOK_SECRET, { token: token });
    }
  });

  server.route([
    {
      method: 'POST',
      path: '/api/signup/basket',
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
      path: '/api/signup/mailchimp',
      handler: routes.mailchimp,
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
            currency: Joi.any().valid(currencyFor.paypal).required(),
            appName: Joi.string()
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
      path: '/api/paypal-redirect/{frequency}/{locale}/{appName}/{accountType}/',
      handler: routes['paypal-redirect']
    }, {
      method: 'GET',
      path: '/api/polyfill.js',
      handler: function(request, reply) {
        var locale = request.query.locale;
        var langHeader = [];
        var langArray = [];

        if (!locale) {
          locale = getLocale(request.headers["accept-language"], locales);
        }

        var features = request.query.features + ',Intl.~locale.' + locale;
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
    }, {
      method: "POST",
      path: "/stripe/charge-succeeded",
      config: {
        auth: "stripe"
      },
      handler: routes['stripe-charge-succeeded']
    }, {
      method: "POST",
      path: "/stripe/charge-failed",
      config: {
        auth: "stripe"
      },
      handler: routes['stripe-charge-failed']
    }, {
      method: "POST",
      path: "/stripe/charge-refunded",
      config: {
        auth: "stripe"
      },
      handler: routes['stripe-charge-refunded']
    }
  ]);

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
                    'https://app.optimizely.com'],
        imgSrc: ['self', 'https://www.google-analytics.com', 'https://q.stripe.com', 'https://pontoon.mozilla.org', 'https://*.shpg.org/',
          'https://cdn.optimizely.com'],
        scriptSrc: ['self', 'unsafe-inline', 'unsafe-eval', 'https://cdn.optimizely.com', 'https://app.optimizely.com',
          'https://optimizely.s3.amazonaws.com', 'https://www.google-analytics.com', 'https://ajax.googleapis.com', 'https://*.shpg.org/',
          'https://js.stripe.com', 'https://checkout.stripe.com', 'https://pontoon.mozilla.org'],
        styleSrc: ['self', 'unsafe-inline', 'https://fonts.googleapis.com',
          'https://maxcdn.bootstrapcdn.com', 'https://pontoon.mozilla.org'],
        mediaSrc: ['https://d24kjznqej0s8a.cloudfront.net']
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
      handler: reactRouted,
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
