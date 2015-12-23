var testRunner = require('./test-runner');
var singlePageStripe = require('./single-page-stripe-test.js');
var singlePagePaypal = require('./single-page-paypal-test.js');
var simplePaypal = require('./simple-paypal-test.js');
var thankYou = require('./thank-you-test.js');

testRunner([
  singlePageStripe,
  singlePagePaypal,
  simplePaypal,
  thankYou
]);
