module.exports = function(driver, By, done) {
  function stripeTest(url, province, signup, address) {
    var country = 'Canada';
    driver.get(url);
    driver.findElement(By.id('amount-other-input')).sendKeys('10');
    driver.findElement(By.css('.page-active .next-button')).click();
    driver.findElement(By.id('payment-cc-label')).click();
    driver.findElement(By.name('cc_number')).clear();
    driver.findElement(By.name('cc_number')).sendKeys('4242424242424242');
    driver.findElement(By.name('cc_expir_month')).clear();
    driver.findElement(By.name('cc_expir_month')).sendKeys('01');
    driver.findElement(By.name('cc_expir_year')).clear();
    driver.findElement(By.name('cc_expir_year')).sendKeys('16');
    driver.findElement(By.name('cc_cvv')).clear();
    driver.findElement(By.name('cc_cvv')).sendKeys('123');
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
  stripeTest('http://localhost:3000/de/', true, false, true);
  driver.wait(function() {
    return driver.getCurrentUrl().then(function(url) {
      return url.indexOf('http://localhost:3000/de/thank-you/') === 0;
    });
  });
  stripeTest('http://localhost:3000/de/?test=signup-test', false, true, true);
  driver.wait(function() {
    return driver.getCurrentUrl().then(function(url) {
      return url.indexOf('http://localhost:3000/de/share/') === 0;
    });
  });
  stripeTest('http://localhost:3000/en-US/?test=address-test', false, false, false);
  driver.wait(function() {
    return driver.getCurrentUrl().then(function(url) {
      return url.indexOf('http://localhost:3000/en-US/thank-you/') === 0;
    });
  }).then(done);
};
