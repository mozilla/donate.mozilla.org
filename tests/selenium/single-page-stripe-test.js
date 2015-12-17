module.exports = function(driver, By, done) {
  driver.get('http://localhost:3000/en-US/');
  driver.findElement(By.id('amount-other-input')).sendKeys('10');
  driver.findElement(By.id('privacy-policy-checkbox')).click();
  driver.findElement(By.id('payment-cc-label')).click();

  driver.switchTo().frame(driver.findElement(By.css(".stripe_checkout_app")));
  var windowHandle = driver.getWindowHandle();
  driver.wait(function() {
    return driver.switchTo().activeElement().getAttribute("id").then(function(id) {
      return id === "email";
    });
  });
  driver.findElement(By.id('email')).sendKeys('send-donation@test.com');
  driver.findElement(By.id('billing-name')).sendKeys('a');
  driver.findElement(By.id('billing-street')).sendKeys('a');
  driver.findElement(By.id('billing-zip')).sendKeys('a');
  driver.findElement(By.id('billing-city')).sendKeys('a');
  driver.findElement(By.id('submitButton')).click();
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
      var result = true;
      if (url.indexOf('http://localhost:3000/en-US/thank-you/') === -1) {
        result = false;
      }
      if (url.indexOf('&str_amount=1000') === -1) {
        result = false;
      }
      if (url.indexOf('&str_currency=usd') === -1) {
        result = false;
      }
      if (url.indexOf('&str_frequency=one-time') === -1) {
        result = false;
      }
      if (url.indexOf('&email=send-donation%40test.com') === -1) {
        result = false;
      }
      if (url.indexOf('&country=Canada') === -1) {
        result = false;
      }
      return result;
    });
  });

  driver.get('http://localhost:3000/en-US/partial-page/');
  driver.findElement(By.id('amount-other-input')).sendKeys('10');
  driver.findElement(By.id('privacy-policy-checkbox')).click();
  driver.findElement(By.id('payment-cc-label')).click();

  driver.switchTo().frame(driver.findElement(By.css(".stripe_checkout_app")));
  windowHandle = driver.getWindowHandle();
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
  driver.findElement(By.id('billing-zip')).sendKeys('a');
  driver.findElement(By.id('submitButton')).click();
  driver.switchTo().window(windowHandle);
  driver.wait(function() {
    return driver.getCurrentUrl().then(function(url) {
      var result = true;
      if (url.indexOf('http://localhost:3000/en-US/thank-you/') === -1) {
        result = false;
      }
      if (url.indexOf('&str_amount=1000') === -1) {
        result = false;
      }
      if (url.indexOf('&str_currency=usd') === -1) {
        result = false;
      }
      if (url.indexOf('&str_frequency=one-time') === -1) {
        result = false;
      }
      if (url.indexOf('&email=send-donation%40test.com') === -1) {
        result = false;
      }
      return result;
    });
  });

  driver.get('http://localhost:3000/pa-IN/');
  driver.findElement(By.id('amount-other-input')).sendKeys('200');
  driver.findElement(By.id('privacy-policy-checkbox')).click();
  driver.findElement(By.css('.submit-btn')).click();

  driver.switchTo().frame(driver.findElement(By.css(".stripe_checkout_app")));
  windowHandle = driver.getWindowHandle();
  driver.wait(function() {
    return driver.switchTo().activeElement().getAttribute("id").then(function(id) {
      return id === "email";
    });
  });
  driver.findElement(By.id('email')).sendKeys('send-donation@test.com');
  driver.findElement(By.id('billing-name')).sendKeys('a');
  driver.findElement(By.id('billing-street')).sendKeys('a');
  driver.findElement(By.id('billing-zip')).sendKeys('a');
  driver.findElement(By.id('billing-city')).sendKeys('a');
  driver.findElement(By.id('submitButton')).click();
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
      var result = true;
      if (url.indexOf('http://localhost:3000/pa-IN/thank-you/') === -1) {
        result = false;
      }
      if (url.indexOf('&str_amount=20000') === -1) {
        result = false;
      }
      if (url.indexOf('&str_currency=inr') === -1) {
        result = false;
      }
      if (url.indexOf('&str_frequency=one-time') === -1) {
        result = false;
      }
      if (url.indexOf('&email=send-donation%40test.com') === -1) {
        result = false;
      }
      if (url.indexOf('&country=Canada') === -1) {
        result = false;
      }
      return result;
    });
  }).then(done);
};
