var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var should = require('should');
var IntlContext =
  {
    messages: {
      please_complete: 'please_complete',
      credit_card_number: 'cc number',
      credit_card_expiration_month: 'cc month',
      credit_card_expiration_year: 'cc year',
      MM: 'MM',
      YY: 'YY',
      CVC: 'CVC',
      cvc_info: 'cvc info'
    }
  };
var stubContext = require('react-test-context');
var {CardNumber, CardCvc, CardExpMonth, CardExpYear} = require('../../components/credit-card-info.jsx');
var items = [CardNumber, CardCvc, CardExpMonth, CardExpYear];

describe('credit-card-info.jsx {CardNumber, CardCvc, CardExpMonth, CardExpYear}', function() {
  var form;
  beforeEach(function() {
    form = require('../../scripts/form.js');
  });
  items.forEach(function(Item) {
    it('.validate() should return false when all fields are not valid', function() {
      should.doesNotThrow(() => {
        var TestInput = stubContext(Item, IntlContext);
        var Page = React.createElement(stubContext(TestInput, IntlContext),{
          name: "test"
        });
        var Document = TestUtils.renderIntoDocument(Page);

        var testElement = Document.getDOMNode().querySelector('input[name="test"]');
        testElement.value = "testValue";
        TestUtils.Simulate.change(testElement);

        should(form.validate(["test"])).equal(false);
      });
    });

    it('.validate() should return false when all fields are empty', function() {
      should.doesNotThrow(() => {
        var TestInput = stubContext(Item, IntlContext);
        var Page = React.createElement(stubContext(TestInput, IntlContext),{
          name: "test"
        });
        TestUtils.renderIntoDocument(Page);
        should(form.validate(["test"])).equal(false);
      });
    });

    it('.validate() should return false when all fields are whitespace', function() {
      should.doesNotThrow(() => {
        var TestInput = stubContext(Item, IntlContext);
        var Page = React.createElement(stubContext(TestInput, IntlContext),{
          name: "test"
        });
        var Document = TestUtils.renderIntoDocument(Page);

        var testElement = Document.getDOMNode().querySelector('input[name="test"]');
        testElement.value = "  ";
        TestUtils.Simulate.change(testElement);

        should(form.validate(["test"])).equal(false);
      });
    });
  });
  it('.validate() should return true when card number is valid', function() {
    should.doesNotThrow(() => {
      var TestInput = stubContext(CardNumber, IntlContext);
      var Page = React.createElement(stubContext(TestInput, IntlContext),{
        name: "test"
      });
      var Document = TestUtils.renderIntoDocument(Page);

      var testElement = Document.getDOMNode().querySelector('input[name="test"]');
      testElement.value = "4242424242424242";
      TestUtils.Simulate.change(testElement);

      should(form.validate(["test"])).equal(true);
    });
  });
  it('.validate() should return false when card number is wrong', function() {
    should.doesNotThrow(() => {
      var TestInput = stubContext(CardNumber, IntlContext);
      var Page = React.createElement(stubContext(TestInput, IntlContext),{
        name: "test"
      });
      var Document = TestUtils.renderIntoDocument(Page);

      var testElement = Document.getDOMNode().querySelector('input[name="test"]');
      testElement.value = "2424242424242424";
      TestUtils.Simulate.change(testElement);

      should(form.validate(["test"])).equal(false);
    });
  });
  it('.validate() should return true when exp month is valid', function() {
    should.doesNotThrow(() => {
      var TestInput = stubContext(CardExpMonth, IntlContext);
      var Page = React.createElement(stubContext(TestInput, IntlContext),{
        name: "test"
      });
      var Document = TestUtils.renderIntoDocument(Page);

      var testElement = Document.getDOMNode().querySelector('input[name="test"]');
      testElement.value = "01";
      TestUtils.Simulate.change(testElement);

      should(form.validate(["test"])).equal(true);
    });
  });
  it('.validate() should return false when exp month is not a month', function() {
    should.doesNotThrow(() => {
      var TestInput = stubContext(CardExpMonth, IntlContext);
      var Page = React.createElement(stubContext(TestInput, IntlContext),{
        name: "test"
      });
      var Document = TestUtils.renderIntoDocument(Page);

      var testElement = Document.getDOMNode().querySelector('input[name="test"]');
      testElement.value = "13";
      TestUtils.Simulate.change(testElement);

      should(form.validate(["test"])).equal(false);
    });
  });
  it('.validate() should return true when exp year is valid', function() {
    should.doesNotThrow(() => {
      var TestInput = stubContext(CardExpYear, IntlContext);
      var Page = React.createElement(stubContext(TestInput, IntlContext),{
        name: "test"
      });
      var Document = TestUtils.renderIntoDocument(Page);

      var testElement = Document.getDOMNode().querySelector('input[name="test"]');
      // When this test fails, it's a milestone! Do we have flying cars yet?
      testElement.value = "29";
      TestUtils.Simulate.change(testElement);

      should(form.validate(["test"])).equal(true);
    });
  });
  it('.validate() should return false when exp year is in the past', function() {
    should.doesNotThrow(() => {
      var TestInput = stubContext(CardExpYear, IntlContext);
      var Page = React.createElement(stubContext(TestInput, IntlContext),{
        name: "test"
      });
      var Document = TestUtils.renderIntoDocument(Page);

      var testElement = Document.getDOMNode().querySelector('input[name="test"]');
      testElement.value = "11";
      TestUtils.Simulate.change(testElement);

      should(form.validate(["test"])).equal(false);
    });
  });
  it('.validate() should return true when cvc is three digits (mastercard or visa)', function() {
    should.doesNotThrow(() => {
      var TestInput = stubContext(CardCvc, IntlContext);
      var Page = React.createElement(stubContext(TestInput, IntlContext),{
        name: "test"
      });
      var Document = TestUtils.renderIntoDocument(Page);

      var testElement = Document.getDOMNode().querySelector('input[name="test"]');
      testElement.value = "123";
      TestUtils.Simulate.change(testElement);

      should(form.validate(["test"])).equal(true);
    });
  });
  it('.validate() should return true when cvc is four digits (amex)', function() {
    should.doesNotThrow(() => {
      var TestInput = stubContext(CardCvc, IntlContext);
      var Page = React.createElement(stubContext(TestInput, IntlContext),{
        name: "test"
      });
      var Document = TestUtils.renderIntoDocument(Page);

      var testElement = Document.getDOMNode().querySelector('input[name="test"]');
      testElement.value = "1234";
      TestUtils.Simulate.change(testElement);

      should(form.validate(["test"])).equal(true);
    });
  });
  it('.validate() should return false when cvc is two digits', function() {
    should.doesNotThrow(() => {
      var TestInput = stubContext(CardCvc, IntlContext);
      var Page = React.createElement(stubContext(TestInput, IntlContext),{
        name: "test"
      });
      var Document = TestUtils.renderIntoDocument(Page);

      var testElement = Document.getDOMNode().querySelector('input[name="test"]');
      testElement.value = "12";
      TestUtils.Simulate.change(testElement);

      should(form.validate(["test"])).equal(false);
    });
  });
});
