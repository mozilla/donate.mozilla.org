module.exports = function(driver, By) {
  return function(done) {
    driver.get('http://localhost:3000/en-US/paypal-donate/');
    driver.findElement(By.id('amount-other-input')).sendKeys('10');
    driver.findElement(By.css('.submit-button .submit-btn')).click();
    driver.wait(function() {
      return driver.getCurrentUrl().then(function(url) {
        return url.indexOf('https://www.sandbox.paypal.com/us/cgi-bin/webscr') === 0;
      });
    });
    driver.findElement(By.id('login_email')).clear();
    driver.findElement(By.id('login_email')).sendKeys('send-donation@test.com');
    driver.findElement(By.id('login_password')).sendKeys('testtest');
    driver.findElement(By.id('login.x')).click();
    driver.findElement(By.id('continue')).click();
    driver.findElement(By.name('merchant_return_link')).click();
    driver.wait(function() {
      return driver.getCurrentUrl().then(function(url) {
        return url.indexOf('http://localhost:3000/en-US/thank-you/') === 0;
      });
    }).then(done);
  };
};
