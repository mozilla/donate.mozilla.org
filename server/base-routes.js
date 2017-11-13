var routes = require('./routes');

var Joi = require('joi');

var locales = require('./locales');
var getLocale = require('../dist/lib/get-locale');
var polyfillio = require('polyfill-service');
var PolyfillSet = require('./lib/PolyfillSet');

var currencyFor = require('./lib/currency-for');
var exchangeRates = require('../assets/exchange-rates/latest.json');

var baseRoutes = [
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
          customerId: Joi.string(),
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
          customerId: Joi.string(),
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
    path: '/api/stripe-monthly-upsell',
    handler: routes.stripeMonthlyUpsell,
    config: {
      payload: {
        maxBytes: 32000,
        allow: 'application/json'
      },
      validate: {
        payload: {
          customerId: Joi.string(),
          currency: Joi.any().valid(currencyFor.stripe).required(),
          amount: Joi.number().required(),
          locale: Joi.string().min(2).max(12).required(),
          description: Joi.string().required()
        }
      },
      response: {
        schema: {
          id: Joi.string(),
          frequency: Joi.string().valid("monthly", "one-time"),
          currency: Joi.any().valid(currencyFor.stripe).required(),
          quantity: Joi.number(),
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
      auth: "stripe",
      payload: {
        output: 'data',
        parse: false
      }
    },
    handler: routes['stripe-dispute']
  }, {
    method: "POST",
    path: "/stripe/charge-succeeded",
    config: {
      auth: "stripe",
      payload: {
        output: 'data',
        parse: false
      }
    },
    handler: routes['stripe-charge-succeeded']
  }, {
    method: "POST",
    path: "/stripe/charge-failed",
    config: {
      auth: "stripe",
      payload: {
        output: 'data',
        parse: false
      }
    },
    handler: routes['stripe-charge-failed']
  }, {
    method: "POST",
    path: "/stripe/charge-refunded",
    config: {
      auth: "stripe",
      payload: {
        output: 'data',
        parse: false
      }
    },
    handler: routes['stripe-charge-refunded']
  }
];

module.exports = baseRoutes;
