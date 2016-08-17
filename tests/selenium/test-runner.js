var server = require('../../server')();
var webdriver = require('selenium-webdriver'),
  By = require('selenium-webdriver').By;
var firefox = require('selenium-webdriver/firefox');
var profile = new firefox.Profile();

module.exports = function(tests) {
  function next() {
    var driver;
    profile.setPreference('marionette', true);
    profile.setPreference('webdriver.gecko.driver', require('path').join(__dirname, '..', 'node_modules', 'geckodriver', 'geckodriver'));
    if (tests.length) {

      driver = new webdriver.Builder().
        forBrowser('firefox').
        setFirefoxOptions(new firefox.Options().setProfile(profile)).
        build();
      driver.manage().timeouts().implicitlyWait(50000);
      tests.shift()(driver, By, function() {
        driver.quit().then(next);
      });
    } else {
      server.stop(function() {
        console.log("finished");
      });
    }
  }
  server.start(next);
};
