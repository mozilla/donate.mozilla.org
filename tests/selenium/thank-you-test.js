module.exports = function(driver, By) {
  function test(noProvince, url) {
    driver.manage().timeouts().implicitlyWait(3000);
    driver.get(url);
    driver.findElement(By.name('email')).sendKeys('test@email.com');
    driver.findElement(By.id('privacy-policy-checkbox')).click();
    driver.findElement(By.css('.submit-btn')).click();
  }
  function start(done) {
    test(false, 'http://localhost:3000/en-US/thank-you/');
    driver.wait(function() {
      return driver.getCurrentUrl().then(function(url) {
        return url.indexOf('http://localhost:3000/en-US/share/') === 0;
      });
    }).then(done);
  }
  return {
    start: start
  };
};
