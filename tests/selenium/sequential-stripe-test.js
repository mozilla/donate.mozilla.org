module.exports = function(driver, By, done) {
  function stripeTest(url, province, signup, address, amount, monthly) {
    var country = 'Canada';
    driver.get(url);
    driver.findElement(By.id('amount-other-input')).sendKeys(amount);
    if (monthly) {
      driver.findElement(By.css('.monthly-payment')).click();
    }
    driver.findElement(By.css('.page-active .next-button')).click();
    driver.wait(function() {
      if (url !== 'http://localhost:3000/pa-IN/sequential/') {
        return driver.findElement(By.css('.payment-cc-label')).isEnabled().then(function(enabled) {
          return enabled;
        });
      }
      return driver.findElement(By.id('card-number-input')).isEnabled().then(function(enabled) {
        return enabled;
      });
    });
    if (url !== 'http://localhost:3000/pa-IN/sequential/') {
      driver.findElement(By.css('.payment-cc-label')).click();
    }
    driver.findElement(By.id('card-number-input')).clear();
    driver.findElement(By.id('card-number-input')).sendKeys('4242424242424242');
    driver.findElement(By.id('exp-month-input')).clear();
    driver.findElement(By.id('exp-month-input')).sendKeys('01');
    driver.findElement(By.id('exp-year-input')).clear();
    driver.findElement(By.id('exp-year-input')).sendKeys('16');
    driver.findElement(By.id('cvc-input')).clear();
    driver.findElement(By.id('cvc-input')).sendKeys('123');
    driver.findElement(By.css('.page-active .next-button')).click();

    driver.findElement(By.name('firstName')).clear();
    driver.findElement(By.name('firstName')).sendKeys('testname');
    driver.findElement(By.name('lastName')).clear();
    driver.findElement(By.name('lastName')).sendKeys('lastname');
    if (!province) {
      country = 'Chile';
    }
    if (address) {
      driver.findElement(By.name('country')).sendKeys(country);
      driver.findElement(By.name('address')).clear();
      driver.findElement(By.name('address')).sendKeys('test address');
      driver.findElement(By.name('city')).clear();
      driver.findElement(By.name('city')).sendKeys('testcity');
      driver.findElement(By.name('code')).clear();
      driver.findElement(By.name('code')).sendKeys('m5g 3u7');
    } else {
      driver.findElement(By.name('country-test')).sendKeys(country);
      driver.findElement(By.name('code-test')).clear();
      driver.findElement(By.name('code-test')).sendKeys('m5g 3u7');
    }
    if (address && province) {
      driver.findElement(By.id('wsstate_cd')).sendKeys('Ontario');
    }
    driver.findElement(By.name('email')).clear();
    driver.findElement(By.name('email')).sendKeys('test@email.com');
    driver.findElement(By.id('privacy-policy-checkbox')).click();
    if (signup) {
      driver.findElement(By.id('signup-checkbox')).click();
    }
    if (address) {
      driver.findElement(By.name('submit-button')).click();
    } else {
      driver.findElement(By.name('submit-button-test')).click();
    }
  }
  stripeTest('http://localhost:3000/de/sequential/', true, false, true, '10.00', true);
  driver.wait(function() {
    return driver.getCurrentUrl().then(function(url) {
      var result = true;
      if (url.indexOf('http://localhost:3000/de/thank-you/') === -1) {
        result = false;
      }
      if (url.indexOf('&str_amount=1000') === -1) {
        result = false;
      }
      if (url.indexOf('&str_currency=eur') === -1) {
        result = false;
      }
      if (url.indexOf('&str_frequency=monthly') === -1) {
        result = false;
      }
      if (url.indexOf('&email=test%40email.com') === -1) {
        result = false;
      }
      if (url.indexOf('&country=CA') === -1) {
        result = false;
      }
      return result;
    });
  });
  stripeTest('http://localhost:3000/de/sequential/?test=signup-test', false, true, true, '10', false);
  driver.wait(function() {
    return driver.getCurrentUrl().then(function(url) {
      var result = true;
      if (url.indexOf('http://localhost:3000/de/share/') === -1) {
        result = false;
      }
      if (url.indexOf('&str_amount=1000') === -1) {
        result = false;
      }
      if (url.indexOf('&str_currency=eur') === -1) {
        result = false;
      }
      if (url.indexOf('&str_frequency=one-time') === -1) {
        result = false;
      }
      return result;
    });
  });
  stripeTest('http://localhost:3000/pa-IN/sequential/', true, false, true, '200', false);
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
      return result;
    });
  });
  stripeTest('http://localhost:3000/en-US/sequential/?test=address-test', false, false, false, '10,00', false);
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
      if (url.indexOf('&email=test%40email.com') === -1) {
        result = false;
      }
      if (url.indexOf('&country=CL') === -1) {
        result = false;
      }
      return result;
    });
  }).then(done);
};
