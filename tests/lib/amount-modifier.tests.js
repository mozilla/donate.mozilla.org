var amountModifier = require("../../scripts/amount-modifier.js");

describe("amount-modifier.js", function() {
  it("'10', 'stripe', 'usd' should return '1000'", function() {
    amountModifier.modify('10', 'stripe', 'usd').should.equal('1000');
  });
  it("'10', 'paypal', 'usd' should return '10'", function() {
    amountModifier.modify('10', 'paypal', 'usd').should.equal('10');
  });
  it("'1000', 'stripe', 'jpy' '1000'", function() {
    amountModifier.modify('1000', 'stripe', 'jpy').should.equal('1000');
  });
  it("10, 'stripe', 'usd' 1000", function() {
    amountModifier.modify(10, 'stripe', 'usd').should.equal('1000');
  });
  it("10, 'PayPal', 'usd' 10", function() {
    amountModifier.modify(10, 'paypal', 'usd').should.equal('10');
  });
  it("'0', 'PayPal', 'usd' '0'", function() {
    amountModifier.modify('0', 'paypal', 'usd').should.equal('0');
  });
  it("0, 'PayPal', 'usd' '0'", function() {
    amountModifier.modify(0, 'paypal', 'usd').should.equal('0');
  });
  it("false, 'PayPal', 'usd' '0'", function() {
    amountModifier.modify(false, 'paypal', 'usd').should.equal('0');
  });
  it("'abcd', 'PayPal', 'usd' 'abcd'", function() {
    amountModifier.modify('abcd', 'paypal', 'usd').should.equal('abcd');
  });
  it("'10.10', 'PayPal', 'huf' '10'", function() {
    amountModifier.modify('10.10', 'paypal', 'huf').should.equal('10');
  });
  it("10.10, 'PayPal', 'huf' '10'", function() {
    amountModifier.modify(10.10, 'paypal', 'huf').should.equal('10');
  });
  it("10.10, 'Stripe', 'jpy' '10'", function() {
    amountModifier.modify(10.10, 'stripe', 'jpy').should.equal('10');
  });
  it("'10.10', 'Stripe', 'jpy' '10'", function() {
    amountModifier.modify('10.10', 'stripe', 'jpy').should.equal('10');
  });
});
