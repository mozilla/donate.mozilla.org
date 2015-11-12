var server = require('../../server')();
var webdriver = require('selenium-webdriver'),
  By = require('selenium-webdriver').By;

module.exports = function(tests) {
  function next() {
    var driver;
    if (tests.length) {
      driver = new webdriver.Builder().
        withCapabilities(webdriver.Capabilities.firefox()).
        build();
      driver.manage().timeouts().implicitlyWait(50000);
      tests.shift()(driver, By, function() {
        driver.quit().then(next);
      });
    } else {
      server.stop();
      console.log("finished");
    }
  }
  server.start(next);
};
