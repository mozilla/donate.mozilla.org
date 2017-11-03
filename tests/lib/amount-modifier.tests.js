var amountModifier = require("../../dist/lib/amount-modifier.js");

describe("amount-modifier.js", function() {
  it("'10', 'stripe', 'usd' should return '1000'", function() {
    var amount = amountModifier.modify('10', 'stripe', 'usd')
    amount.should.equal('1000');
    var original = amountModifier.reverse(amount, 'stripe', 'usd');
    original.should.equal('10');
  });
  it("'10', 'paypal', 'usd' should return '10'", function() {
    var amount = amountModifier.modify('10', 'paypal', 'usd');
    amount.should.equal('10');
    var original = amountModifier.reverse(amount, 'paypal', 'usd');
    original.should.equal('10');
  });
  it("'1000', 'stripe', 'jpy' should return '1000'", function() {
    var amount = amountModifier.modify('1000', 'stripe', 'jpy');
    amount.should.equal('1000');
    var original = amountModifier.reverse(amount, 'stripe', 'jpy');
    original.should.equal('1000');
  });
  it("10, 'stripe', 'usd' should return '1000'", function() {
    var amount = amountModifier.modify(10, 'stripe', 'usd');
    amount.should.equal('1000');
    var original = amountModifier.reverse(amount, 'stripe', 'usd');
    original.should.equal('10');
  });
  it("10, 'PayPal', 'usd' should return '10'", function() {
    var amount = amountModifier.modify(10, 'paypal', 'usd');
    amount.should.equal('10');
    var original = amountModifier.reverse(10, 'paypal', 'usd');
    original.should.equal('10');
  });
  it("'0', 'PayPal', 'usd' should return '0'", function() {
    var amount = amountModifier.modify('0', 'paypal', 'usd');
    amount.should.equal('0');
    var original = amountModifier.reverse(amount, 'paypal', 'usd');
    original.should.equal('0');
  });
  it("0, 'PayPal', 'usd' should return '0'", function() {
    var amount = amountModifier.modify(0, 'paypal', 'usd');
    amount.should.equal('0');
    var original = amountModifier.reverse(amount, 'paypal', 'usd');
    original.should.equal('0');
  });
  it("false, 'PayPal', 'usd' should return '0'", function() {
    var amount = amountModifier.modify(false, 'paypal', 'usd');
    amount.should.equal('0');
    var original = amountModifier.reverse(amount, 'paypal', 'usd');
    original.should.equal('0');
  });
  it("'abcd', 'PayPal', 'usd' should return 'abcd'", function() {
    var amount = amountModifier.modify('abcd', 'paypal', 'usd');
    amount.should.equal('abcd');
    var original = amountModifier.reverse(amount, 'paypal', 'usd');
    original.should.equal('abcd');
  });
  it("'10.10', 'PayPal', 'huf' should return '10'", function() {
    var amount = amountModifier.modify('10.10', 'paypal', 'huf');
    amount.should.equal('10');
    var original = amountModifier.reverse(amount, 'paypal', 'huf');
    original.should.equal('10');
  });
  it("'10.10', 'PayPal', 'twd' should return '10'", function() {
    var amount = amountModifier.modify('10.10', 'paypal', 'twd');
    amount.should.equal('10');
    var original = amountModifier.reverse(amount, 'paypal', 'twd');
    original.should.equal('10');
  });
  it("10.10, 'PayPal', 'huf' should return '10'", function() {
    var amount = amountModifier.modify(10.10, 'paypal', 'huf');
    amount.should.equal('10');
    var original = amountModifier.reverse(amount, 'paypal', 'huf');
    original.should.equal('10');
  });
  it("10.10, 'Stripe', 'jpy' should return '10'", function() {
    var amount = amountModifier.modify(10.10, 'stripe', 'jpy');
    amount.should.equal('10');
    var original = amountModifier.reverse(amount, 'stripe', 'jpy');
    original.should.equal('10');
  });
  it("'10.10', 'Stripe', 'jpy' should return '10'", function() {
    var amount = amountModifier.modify('10.10', 'stripe', 'jpy');
    amount.should.equal('10');
    var original = amountModifier.reverse(amount, 'stripe', 'jpy');
    original.should.equal('10');
  });
  it("'2.01', 'Stripe', 'usd' should return '201'", function() {
    var amount = amountModifier.modify('2.01', 'stripe', 'usd');
    amount.should.equal('201');
    var original = amountModifier.reverse(amount, 'stripe', 'usd');
    original.should.equal('2.01');
  });
});
