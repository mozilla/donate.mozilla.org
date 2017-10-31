var goodConfig = {
  reporter: require('good-console-logfmt')
};

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

var services = [
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
];

module.exports = services;
