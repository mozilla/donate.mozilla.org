var testRunner = require('./test-runner');
var singlePageStripe = require('./single-page-stripe-test.js');
var singlePagePaypal = require('./single-page-paypal-test.js');
var singlePageThunderbirdStripe = require('./single-page-thunderbird-stripe-test.js');
var singlePageThunderbirdPayPal = require('./single-page-thunderbird-paypal-test.js');
var thankYou = require('./thank-you-test.js');

testRunner([
  singlePageStripe,
  singlePagePaypal,
  singlePageThunderbirdPayPal,
  singlePageThunderbirdStripe,
  thankYou
]);
