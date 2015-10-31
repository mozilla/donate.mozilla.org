var webdriver = require('selenium-webdriver'),
  By = require('selenium-webdriver').By;
var driver = new webdriver.Builder().
  withCapabilities(webdriver.Capabilities.firefox()).
  build();

var sequentialForm = require('./sequential-form-test.js')(driver, By);
var thankYou = require('./thank-you-test.js')(driver, By);
var testRunner = require('./test-runner')([
  sequentialForm,
  thankYou
]);

testRunner.start(function() {
  driver.quit();
});
