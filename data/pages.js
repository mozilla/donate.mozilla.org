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
  '/give-bitcoin/': {
    name: 'give-bitcoin',
    path: '/:locale/give-bitcoin/?',
    handler: require('../pages/give-bitcoin.jsx')
  },
  '/thunderbird/': {
    name: 'thunderbird-onepage',
    path: '/:locale/thunderbird/?',
    handler: require('../pages/thunderbird/one-page.jsx')
  },
  '/thunderbird/about/': {
    name: 'thunderbird-about',
    path: '/:locale/thunderbird/about/?',
    handler: require('../pages/thunderbird/about.jsx')
  },
  '/thunderbird/thank-you/': {
    name: 'thunderbird-thank-you',
    path: '/:locale/thunderbird/thank-you/?',
    handler: require('../pages/thunderbird/thank-you.jsx')
  },
  '/thunderbird/share/': {
    name: 'thunderbird-share',
    path: '/:locale/thunderbird/share/?',
    handler: require('../pages/thunderbird/share.jsx')
  }
};

module.exports = pages;
