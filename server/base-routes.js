const routes = require('./routes');

const Joi = require('joi');

const locales = require('./locales');
const getLocale = require('../dist/lib/get-locale');
const polyfillio = require('polyfill-service');
const PolyfillSetFromQueryParams = require('./lib/PolyfillSet');

const currencyFor = require('./lib/currency-for');
const exchangeRates = require('../assets/exchange-rates/latest.json');

const baseRoutes = [
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
    path: '/api/stripe-checkout',
    config: {
      pre: [
        routes.reCaptcha
      ],
      handler: routes.stripe,
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
          code: Joi.string().allow(''),
          description: Joi.string().required(),
          donation_url: Joi.string().required(),
          reCaptchaToken: Joi.string().allow('')
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
    path: '/api/stripe-monthly-upgrade',
    handler: routes.stripeMonthlyUpgrade,
    config: {
      payload: {
        maxBytes: 32000,
        allow: 'application/json'
      },
      validate: {
        payload: {
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
          appName: Joi.string(),
          donation_url: Joi.string().required()
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
    handler: function(request, h) {
      var locale = request.query.locale;

      if (!locale) {
        locale = getLocale(request.headers["accept-language"], locales);
      }

      var features = request.query.features + ',Intl.~locale.' + locale;
      var flags = request.query.flags ? request.query.flags.split(',') : [];

      var polyfills = PolyfillSetFromQueryParams(features || 'default', flags);
      var params = {
        features: polyfills.get(),
        minify: true,
        unknown: 'polyfill'
      };
      params.uaString = request.plugins.scooter.source;

      return new Promise((resolve) => {
        polyfillio.getPolyfillString(params).then(function(bundleString) {
          resolve(h.response(bundleString).type('application/javascript; charset=utf-8').vary('User-Agent'));
        });
      });
    },
    config: {
      cache: {
        expiresIn: 7 * 24 * 60 * 60 * 1000, // one week
        privacy: 'public'
      }
    }
  }, {
    method: 'GET',
    path: '/api/client-env.js',
    handler: function(request, h) {
      //
      // WARNING! Only put variables safe for public consumption here! This is emitted on the client side!
      //
      // NEVER PUT PRIVATE KEYS HERE!!!
      //
      var env = {
        APPLICATION_URI: process.env.APPLICATION_URI,
        STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
        RECAPTCHA_PUBLIC_KEY: process.env.RECAPTCHA_PUBLIC_KEY,
        RECAPTCHA_DISABLED: process.env.RECAPTCHA_DISABLED,
        OPTIMIZELY_ID: process.env.OPTIMIZELY_ID,
        OPTIMIZELY_ACTIVE: process.env.OPTIMIZELY_ACTIVE,
        FULL_SUBDOMAIN_FOR_COOKIE: process.env.FULL_SUBDOMAIN_FOR_COOKIE
      };

      var clientEnv = `window.__clientenv__ = ${ JSON.stringify(env) };`;
      return h.response(clientEnv).type('application/javascript; charset=utf-8').vary('User-Agent');
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
    handler: function(request, h) {
      return h.response(exchangeRates).type('application/json; charset=utf-8');
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
