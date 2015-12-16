var pages = {
  '/': {
    name: 'one-page',
    path: '/:locale/',
    handler: require('../pages/one-page.jsx')
  },
  '/about/': {
    name: 'about',
    path: '/:locale/about/?',
    handler: require('../pages/about.jsx')
  },
  '/thank-you/': {
    name: 'thank-you',
    path: '/:locale/thank-you/?',
    handler: require('../pages/thank-you.jsx')
  },
  '/share/': {
    name: 'share',
    path: '/:locale/share/?',
    handler: require('../pages/share.jsx')
  },
  '/survey/': {
    name: 'survey',
    path: '/:locale/survey/?',
    handler: require('../pages/survey.jsx')
  },
  '/give-bitcoin/': {
    name: 'give-bitcoin',
    path: '/:locale/give-bitcoin/?',
    handler: require('../pages/give-bitcoin.jsx')
  },
  '/sequential/': {
    name: 'sequential',
    path: '/:locale/sequential/?',
    handler: require('../pages/sequential.jsx')
  },
  '/paypal-donate/': {
    name: 'paypal-donate',
    path: '/:locale/paypal-donate/?',
    handler: require('../pages/paypal-donate.jsx')
  },
  '/directory-tiles/': {
    name: 'directory-tiles',
    path: '/:locale/directory-tiles/?',
    handler: require('../pages/directory-tiles.jsx')
  }
};

module.exports = pages;
