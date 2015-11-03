module.exports = function(driver, By) {
  return function(done) {
    driver.get('http://localhost:3000/en-US/thank-you/');
    driver.findElement(By.name('email')).sendKeys('test@email.com');
    driver.findElement(By.id('privacy-policy-checkbox')).click();
    driver.findElement(By.css('.submit-btn')).click();
    driver.wait(function() {
      return driver.getCurrentUrl().then(function(url) {
        return url.indexOf('http://localhost:3000/en-US/share/') === 0;
      });
    }).then(done);
  };
};
