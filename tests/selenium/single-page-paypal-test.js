module.exports = function(driver, By) {
  return function(done) {
    driver.get('http://localhost:3000/en-US/one-page/');
    driver.findElement(By.id('amount-other-input')).sendKeys('10');
    driver.findElement(By.css('.paypal-button .payment-submit-button')).click();
    driver.wait(function() {
      return driver.getCurrentUrl().then(function(url) {
        return url.indexOf('https://www.sandbox.paypal.com/cgi-bin/webscr') === 0;
      });
    });
    var windowHandle = driver.getWindowHandle();
    driver.switchTo().frame(driver.findElement(By.name("injectedUl")));
    driver.findElement(By.id('email')).clear();
    driver.findElement(By.id('email')).sendKeys('send-donation@test.com');
    driver.findElement(By.id('password')).sendKeys('testtest');
    driver.findElement(By.id('btnLogin')).click();
    driver.switchTo().window(windowHandle);
    driver.findElement(By.id('confirmButtonTop')).click();
    driver.wait(function() {
      return driver.getCurrentUrl().then(function(url) {
        return url.indexOf('http://localhost:3000/en-US/thank-you/') === 0;
      });
    }).then(done);
  };
};
