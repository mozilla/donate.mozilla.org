var server = require('../../server');
var webdriver = require('selenium-webdriver'),
  By = require('selenium-webdriver').By;
var driver = new webdriver.Builder().
  withCapabilities(webdriver.Capabilities.firefox()).
  build();

driver.manage().timeouts().implicitlyWait(50000);

var testRunner = require('./test-runner');
var sequentialStripe = require('./sequential-stripe-test.js')(driver, By);
var sequentialPaypal = require('./sequential-paypal-test.js')(driver, By);
var singlePageStripe = require('./single-page-stripe-test.js')(driver, By);
var singlePagePaypal = require('./single-page-paypal-test.js')(driver, By);
var simplePaypal = require('./simple-paypal-test.js')(driver, By);
var thankYou = require('./thank-you-test.js')(driver, By);

server.start(function() {
  testRunner([
    sequentialStripe,
    sequentialPaypal,
    singlePageStripe,
    singlePagePaypal,
    simplePaypal,
    thankYou,
    function() {
      server.stop(function() {
        driver.quit();
      });
    }
  ]);
});
