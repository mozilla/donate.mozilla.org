var testRunner = require('./test-runner');
var sequentialStripe = require('./sequential-stripe-test.js');
var sequentialPaypal = require('./sequential-paypal-test.js');
var singlePageStripe = require('./single-page-stripe-test.js');
var singlePagePaypal = require('./single-page-paypal-test.js');
var singlePageThunderbirdStripe = require('./single-page-thunderbird-stripe-test.js');
var singlePageThunderbirdPayPal = require('./single-page-thunderbird-paypal-test.js');
var simplePaypal = require('./simple-paypal-test.js');
var thankYou = require('./thank-you-test.js');

testRunner([
  sequentialStripe,
  sequentialPaypal,
  singlePageStripe,
  singlePagePaypal,
  singlePageThunderbirdPayPal,
  singlePageThunderbirdStripe,
  simplePaypal,
  thankYou
]);
