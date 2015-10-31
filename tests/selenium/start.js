var webdriver = require('selenium-webdriver'),
  By = require('selenium-webdriver').By;
var driver = new webdriver.Builder().
  withCapabilities(webdriver.Capabilities.firefox()).
  build();

var sequentialForm = require('./sequential-form-test.js')(driver, By);

var testRunner = require('./test-runner')([sequentialForm]);

testRunner.start(driver.quit);
