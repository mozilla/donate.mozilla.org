let squeezeArgs;

if (process.env.NPM_CONFIG_PRODUCTION === 'true') {
  squeezeArgs = {
    error: '*',
    request: [
      'signup',
      'mailchimp',
      'stripe',
      'paypal'
    ]
  };
} else {
  squeezeArgs = {
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

let services = [];

services.unshift({ plugin: require('inert') });

// Optionally disable request logging
if (!process.env.DISABLE_LOGGING) {
  services.unshift({
    plugin: require('good'),
    options: {
      ops: false,
      reporters: {
        defaultReporter: [
          {
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [squeezeArgs]
          },
          {
            module: 'good-console'
          },
          'stdout'
        ]
      }
    }
  });
}

services.unshift(
  { plugin: require('scooter') },
  {
    plugin: require('blankie'),
    options: {
      generateNonces: false,
      connectSrc: ['self', 'https://checkout.stripe.com', 'https://api.stripe.com', 'https://pontoon.mozilla.org'],
      fontSrc: ['self', 'https://fonts.gstatic.com', 'https://maxcdn.bootstrapcdn.com', 'https://pontoon.mozilla.org'],
      frameSrc: ['https://js.stripe.com', 'https://checkout.stripe.com', 'https://pontoon.mozilla.org',
        'https://www.google.com/recaptcha/api2/'],
      imgSrc: ['self', 'https://www.google-analytics.com', 'https://q.stripe.com', 'https://pontoon.mozilla.org', 'https://*.shpg.org/'],
      scriptSrc: ['self', 'unsafe-inline',
        'https://www.google-analytics.com', 'https://ajax.googleapis.com', 'https://*.shpg.org/',
        'https://js.stripe.com', 'https://checkout.stripe.com', 'https://pontoon.mozilla.org',
        'https://www.google.com/recaptcha/api.js', 'https://www.gstatic.com/recaptcha/api2/'],
      styleSrc: ['self', 'unsafe-inline', 'https://fonts.googleapis.com',
        'https://maxcdn.bootstrapcdn.com', 'https://pontoon.mozilla.org'],
      mediaSrc: ['https://d24kjznqej0s8a.cloudfront.net', 'https://assets.mofoprod.net']
    }
  }
);

module.exports = services;
