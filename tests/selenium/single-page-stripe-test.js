module.exports = function(driver, By, done) {
  driver.get('http://localhost:3000/en-US/one-page');
  driver.findElement(By.id('amount-other-input')).sendKeys('10');
  driver.findElement(By.id('payment-cc-label')).click();

  driver.switchTo().frame(driver.findElement(By.css(".stripe_checkout_app")));
  var windowHandle = driver.getWindowHandle();
  driver.wait(function() {
    return driver.switchTo().activeElement().getAttribute("id").then(function(id) {
      return id === "email";
    });
  });
  driver.findElement(By.id('email')).sendKeys('send-donation@test.com');
  driver.findElement(By.id('card_number')).sendKeys('4242');
  driver.findElement(By.id('card_number')).sendKeys('4242');
  driver.findElement(By.id('card_number')).sendKeys('4242');
  driver.findElement(By.id('card_number')).sendKeys('4242');
  driver.findElement(By.id('cc-exp')).sendKeys('01');
  driver.findElement(By.id('cc-exp')).sendKeys('16');
  driver.findElement(By.id('cc-csc')).sendKeys('123');
  driver.findElement(By.id('submitButton')).click();
  driver.switchTo().window(windowHandle);
  driver.wait(function() {
    return driver.getCurrentUrl().then(function(url) {
      return url.indexOf('http://localhost:3000/en-US/thank-you/') === 0;
    });
  }).then(done);
};
