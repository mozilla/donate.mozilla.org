var pages = {
  "/thank-you": {
    name: "thank-you",
    path: "/thank-you/?",
    handler: require('../pages/thank-you.jsx')
  },
  "/": {
    name: "sequential",
    path: "/?",
    handler: require('../pages/sequential.jsx')
  },
  "/share": {
    name: "share",
    path: "/share/?",
    handler: require('../pages/share.jsx')
  },
  "/give-bitcoin": {
    name: "give-bitcoin",
    path: "/give-bitcoin/?",
    handler: require('../pages/give-bitcoin.jsx')
  }
};

module.exports = pages;
