var pages = {
  '/': {
    name: 'one-page',
    component: require('../pages/one-page.jsx')
  },
  '/about/': {
    name: 'about',
    component: require('../pages/about.jsx')
  },
  '/one-page-monthly/': {
    name: 'one-page-monthly',
    component: require('../pages/one-page-monthly.jsx')
  },
  '/thank-you/': {
    name: 'thank-you',
    component: require('../pages/thank-you.jsx')
  },
  '/share/': {
    name: 'share',
    component: require('../pages/share.jsx')
  },
  '/survey/': {
    name: 'survey',
    component: require('../pages/survey.jsx')
  },
  '/give-bitcoin/': {
    name: 'give-bitcoin',
    component: require('../pages/give-bitcoin.jsx')
  },
  '/paypal-donate/': {
    name: 'paypal-donate',
    component: require('../pages/paypal-donate.jsx')
  },
  '/directory-tiles/': {
    name: 'directory-tiles',
    component: require('../pages/directory-tiles.jsx')
  },
  '/thunderbird/': {
    name: 'thunderbird-onepage',
    component: require('../pages/thunderbird/one-page.jsx')
  },
  '/thunderbird/about/': {
    name: 'thunderbird-about',
    component: require('../pages/thunderbird/about.jsx')
  },
  '/thunderbird/thank-you/': {
    name: 'thunderbird-thank-you',
    component: require('../pages/thunderbird/thank-you.jsx')
  },
  '/thunderbird/share/': {
    name: 'thunderbird-share',
    component: require('../pages/thunderbird/share.jsx')
  }
};

module.exports = pages;
