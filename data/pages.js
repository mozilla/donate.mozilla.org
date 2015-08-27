var pages = {
  '/': {
    name: 'sequential',
    path: '/:locale/',
    handler: require('../pages/sequential.jsx')
  },
  '/thank-you': {
    name: 'thank-you',
    path: '/:locale/thank-you/?',
    handler: require('../pages/thank-you.jsx')
  },
  '/share': {
    name: 'share',
    path: '/:locale/share/?',
    handler: require('../pages/share.jsx')
  },
  '/give-bitcoin': {
    name: 'give-bitcoin',
    path: '/:locale/give-bitcoin/?',
    handler: require('../pages/give-bitcoin.jsx')
  },
  '/one-page': {
    name: 'one-page',
    path: '/:locale/one-page/?',
    handler: require('../pages/single-form.jsx')
  },
  '/paypal-donate': {
    name: 'paypal-donate',
    path: '/:locale/paypal-donate/?',
    handler: require('../pages/paypal-donate.jsx')
  }
};

module.exports = pages;
