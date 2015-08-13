var server = require('../../server');
server.start(function() {
  var webdriver = require('selenium-webdriver'),
      By = require('selenium-webdriver').By;

  var driver = new webdriver.Builder().
     withCapabilities(webdriver.Capabilities.firefox()).
     build();

  driver.manage().timeouts().implicitlyWait(30000);
  driver.get("http://localhost:3000");
  driver.findElement(By.xpath("//fieldset[@id='page-1']/div[3]/div/label")).click();
  driver.findElement(By.linkText("Next")).click();
  driver.findElement(By.id("payment-cc-label")).click();
  driver.findElement(By.name("cc_number")).clear();
  driver.findElement(By.name("cc_number")).sendKeys("4242424242424242");
  driver.findElement(By.name("cc_expir_month")).clear();
  driver.findElement(By.name("cc_expir_month")).sendKeys("01");
  driver.findElement(By.name("cc_expir_year")).clear();
  driver.findElement(By.name("cc_expir_year")).sendKeys("16");
  driver.findElement(By.name("cc_cvv")).clear();
  driver.findElement(By.name("cc_cvv")).sendKeys("123");
  driver.findElement(By.linkText("Next")).click();
  driver.findElement(By.name("firstname")).clear();
  driver.findElement(By.name("firstname")).sendKeys("testname");
  driver.findElement(By.name("lastname")).clear();
  driver.findElement(By.name("lastname")).sendKeys("lastname");
  driver.findElement(By.name("country")).sendKeys("Canada");
  driver.findElement(By.name("addr1")).clear();
  driver.findElement(By.name("addr1")).sendKeys("test address");
  driver.findElement(By.name("city")).clear();
  driver.findElement(By.name("city")).sendKeys("testcity");
  driver.findElement(By.name("zip")).clear();
  driver.findElement(By.name("zip")).sendKeys("m5g 3u7");
  driver.findElement(By.id("wsstate_cd")).sendKeys("Ontario");
  driver.findElement(By.name("email")).clear();
  driver.findElement(By.name("email")).sendKeys("test@email.com");
  driver.findElement(By.id("legalConfirm")).click();
  driver.findElement(By.id("donate-btn")).click();
  driver.wait(function() {
    return driver.getCurrentUrl().then(function (url) {
      return url === "http://localhost:3000/thank-you/";
    });
  }, 10000)

  driver.quit();
});


