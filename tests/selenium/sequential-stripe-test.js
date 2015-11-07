module.exports = function(driver, By, done) {
  function stripeTest(noProvince, url) {
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
    if (noProvince) {
      country = 'Chile';
    }
    driver.findElement(By.name('country')).sendKeys(country);
    driver.findElement(By.name('address')).clear();
    driver.findElement(By.name('address')).sendKeys('test address');
    driver.findElement(By.name('city')).clear();
    driver.findElement(By.name('city')).sendKeys('testcity');
    driver.findElement(By.name('code')).clear();
    driver.findElement(By.name('code')).sendKeys('m5g 3u7');
    if (!noProvince) {
      driver.findElement(By.id('wsstate_cd')).sendKeys('Ontario');
    }
    driver.findElement(By.name('email')).clear();
    driver.findElement(By.name('email')).sendKeys('test@email.com');
    driver.findElement(By.id('privacy-policy-checkbox')).click();
    if (noProvince) {
      driver.findElement(By.id('signup-checkbox')).click();
    }
    driver.findElement(By.css('.submit-btn')).click();
  }
  stripeTest(false, 'http://localhost:3000/de/');
  driver.wait(function() {
    return driver.getCurrentUrl().then(function(url) {
      return url.indexOf('http://localhost:3000/de/thank-you/') === 0;
    });
  });
  stripeTest(true, 'http://localhost:3000/de/?test=signup-test');
  driver.wait(function() {
    return driver.getCurrentUrl().then(function(url) {
      return url.indexOf('http://localhost:3000/de/share/') === 0;
    });
  }).then(done);
};
