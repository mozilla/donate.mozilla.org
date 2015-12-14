module.exports = function(driver, By, done) {
  driver.get('http://localhost:3000/en-US/');
  driver.findElement(By.id('amount-other-input')).sendKeys('10');
  driver.findElement(By.id('privacy-policy-checkbox')).click();
  driver.findElement(By.css('.paypal-button .payment-paypal-label')).click();
  driver.wait(function() {
    return driver.getCurrentUrl().then(function(url) {
      return url.indexOf('https://www.sandbox.paypal.com/cgi-bin/webscr') === 0;
    });
  });
  driver.switchTo().frame(driver.findElement(By.name("injectedUl")));
  driver.findElement(By.id('email')).clear();
  driver.findElement(By.id('email')).sendKeys('send-donation@test.com');
  driver.findElement(By.id('password')).sendKeys('testtest');
  driver.findElement(By.id('btnLogin')).click();
  driver.switchTo().defaultContent();
  driver.findElement(By.id('confirmButtonTop')).click();
  driver.wait(function() {
    return driver.getCurrentUrl().then(function(url) {
      var result = true;
      if (url.indexOf('http://localhost:3000/en-US/thank-you/') === -1) {
        result = false;
      }
      if (url.indexOf('&amt=10.00') === -1) {
        result = false;
      }
      if (url.indexOf('&cc=USD') === -1) {
        result = false;
      }
      if (url.indexOf('?frequency=single') === -1) {
        result = false;
      }
      return result;
    });
  }).then(done);
};
