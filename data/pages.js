var pages = {
  '/': {
    name: 'one-page',
    path: '/:locale/',
    component: require('../pages/one-page.jsx')
  },
  '/partial-page/': {
    name: 'partial-page',
    path: '/:locale/partial-page/?',
    component: require('../pages/partial-page.jsx')
  },
  '/about/': {
    name: 'about',
    path: '/:locale/about/?',
    component: require('../pages/about.jsx')
  },
  '/one-page-monthly/': {
    name: 'one-page-monthly',
    path: '/:locale/one-page-monthly/?',
    component: require('../pages/one-page-monthly.jsx')
  },
  '/thank-you/': {
    name: 'thank-you',
    path: '/:locale/thank-you/?',
    component: require('../pages/thank-you.jsx')
  },
  '/share/': {
    name: 'share',
    path: '/:locale/share/?',
    component: require('../pages/share.jsx')
  },
  '/survey/': {
    name: 'survey',
    path: '/:locale/survey/?',
    component: require('../pages/survey.jsx')
  },
  '/give-bitcoin/': {
    name: 'give-bitcoin',
    path: '/:locale/give-bitcoin/?',
    component: require('../pages/give-bitcoin.jsx')
  },
  '/sequential/': {
    name: 'sequential',
    path: '/:locale/sequential/?',
    component: require('../pages/sequential.jsx')
  },
  '/paypal-donate/': {
    name: 'paypal-donate',
    path: '/:locale/paypal-donate/?',
    component: require('../pages/paypal-donate.jsx')
  },
  '/directory-tiles/': {
    name: 'directory-tiles',
    path: '/:locale/directory-tiles/?',
    component: require('../pages/directory-tiles.jsx')
  },
  '/thunderbird/': {
    name: 'thunderbird-onepage',
    path: '/:locale/thunderbird/?',
    component: require('../pages/thunderbird/one-page.jsx')
  },
  '/thunderbird/about/': {
    name: 'thunderbird-about',
    path: '/:locale/thunderbird/about/?',
    component: require('../pages/thunderbird/about.jsx')
  },
  '/thunderbird/thank-you/': {
    name: 'thunderbird-thank-you',
    path: '/:locale/thunderbird/thank-you/?',
    component: require('../pages/thunderbird/thank-you.jsx')
  },
  '/thunderbird/share/': {
    name: 'thunderbird-share',
    path: '/:locale/thunderbird/share/?',
    component: require('../pages/thunderbird/share.jsx')
  }
};

module.exports = pages;
