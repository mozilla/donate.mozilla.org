var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var should = require('should');
var IntlContext = { messages: {'donation_min_error': 'donation_min_error', 'please_select_an_amount': 'please_select_an_amount', 'other_amount': 'other_amount'} };
var stubContext = require('react-test-context');
var AmountButtons = require('../../components/amount-buttons.jsx');
var listener = require('../../scripts/listener.js');

describe('amount-buttons.jsx', function() {
  var form;
  beforeEach(function() {
    form = require('../../scripts/form.js');
  });
  it('AmountButtons should select the right button after amount, frequency, currency, and presets are provided', function() {
    should.doesNotThrow(() => {
      var TestInput = stubContext(AmountButtons, IntlContext);
      var Page = React.createElement(stubContext(TestInput, IntlContext),{
        locales: ["en-US"],
        name: "test"
      });
      var Document = TestUtils.renderIntoDocument(Page);

      form.updateState('presets', ["1","2","3","4"]);
      form.updateState('currency', {
        code: 'dkk',
        minAmount: '12',
        symbol: 'kr',
        presets: {
          single: ['1000', '500', '250', '150'],
          monthly: ['150', '100', '75', '50']
        }
      });
      form.updateField('frequency', 'monthly');
      form.updateField('amount', '150');

      var testElement = Document.getDOMNode().querySelector('#amount-150');
      var checked = testElement.checked;
      React.unmountComponentAtNode(Document.getDOMNode().parentNode);
      should(checked).equal(true);
    });
  });
  it('form.updateField amount to 42 should set other input value to 42', function() {
    should.doesNotThrow(() => {
      var TestInput = stubContext(AmountButtons, IntlContext);
      var Page = React.createElement(stubContext(TestInput, IntlContext),{
        locales: ["en-US"],
        name: "test"
      });
      var Document = TestUtils.renderIntoDocument(Page);

      form.updateField('amount', '42');
      var testElement = Document.getDOMNode().querySelector('#amount-other-input');
      var value = testElement.value;
      React.unmountComponentAtNode(Document.getDOMNode().parentNode);
      should(value).equal('42');
    });
  });
  it('currency updates should clear selected amount', function() {
    should.doesNotThrow(() => {
      var TestInput = stubContext(AmountButtons, IntlContext);
      var Page = React.createElement(stubContext(TestInput, IntlContext),{
        locales: ["en-US"],
        name: "test"
      });
      var Document = TestUtils.renderIntoDocument(Page);

      var testElement = Document.getDOMNode().querySelector('#amount-other-input');
      testElement.value = '123';
      TestUtils.Simulate.change(testElement);
      form.updateState('currency', {
        code: 'dkk',
        minAmount: '12',
        symbol: 'kr',
        presets: {
          single: ['1000', '500', '250', '150'],
          monthly: ['150', '100', '75', '50']
        }
      });
      var value = testElement.value;
      React.unmountComponentAtNode(Document.getDOMNode().parentNode);
      should(value).equal('');
    });
  });
  it('other input should show commas in pt-BR for initial values', function() {
    should.doesNotThrow(() => {
      var TestInput = stubContext(AmountButtons, IntlContext);
      var Page = React.createElement(stubContext(TestInput, IntlContext),{
        locales: ["pt-BR"],
        name: "test"
      });
      var Document = TestUtils.renderIntoDocument(Page);

      var testElement = Document.getDOMNode().querySelector('#amount-other-input');
      form.updateField('amount', '2000.99');
      var value = testElement.value;
      React.unmountComponentAtNode(Document.getDOMNode().parentNode);
      should(value).equal('2.000,99');
    });
  });
  function numberFormatTest(locale, testValue, expects) {
    it(locale + ' with ' + testValue + ' should be ' + expects, function() {
      should.doesNotThrow(() => {
        var TestInput = stubContext(AmountButtons, IntlContext);
        var Page = React.createElement(stubContext(TestInput, IntlContext),{
          locales: [locale],
          name: "test"
        });
        var Document = TestUtils.renderIntoDocument(Page);
        function onFieldUpdated(e) {
          var detail = e.detail;
          var value = detail.value;
          if (detail.field === "amount") {
            listener.off('fieldUpdated', onFieldUpdated);
            React.unmountComponentAtNode(Document.getDOMNode().parentNode);
            should(value).equal(expects);
          }
        }
        listener.on('fieldUpdated', onFieldUpdated);

        var testElement = Document.getDOMNode().querySelector('#amount-other-input');
        testElement.value = testValue;
        TestUtils.Simulate.change(testElement);
      });
    });
  }
  numberFormatTest('en-US', '1,001.23', '1001.23');
  numberFormatTest('en-US', '1.001,23', '1001.23');
  numberFormatTest('pt-BR', '1,001.23', '1001.23');
  numberFormatTest('pt-BR', '1.001,23', '1001.23');

  numberFormatTest('en-US', '1,00,1.23', '1001.23');
  numberFormatTest('en-US', '1.00.1,23', '1001.23');
  numberFormatTest('pt-BR', '1,00,1.23', '1001.23');
  numberFormatTest('pt-BR', '1.00.1,23', '1001.23');

  numberFormatTest('en-US', '1,10', '1.10');
  numberFormatTest('en-US', '1.10', '1.10');
  numberFormatTest('pt-BR', '1,10', '1.10');
  numberFormatTest('pt-BR', '1.10', '1.10');

  numberFormatTest('en-US', '110,50', '110.50');
  numberFormatTest('en-US', '110.50', '110.50');
  numberFormatTest('pt-BR', '110,50', '110.50');
  numberFormatTest('pt-BR', '110.50', '110.50');

  numberFormatTest('en-US', '110,504', '110504');
  numberFormatTest('en-US', '110.504', '110504');
  numberFormatTest('pt-BR', '110,504', '110504');
  numberFormatTest('pt-BR', '110.504', '110504');
  it('switching presets should keep preset position', function() {
    should.doesNotThrow(() => {
      var TestInput = stubContext(AmountButtons, IntlContext);
      var Page = React.createElement(stubContext(TestInput, IntlContext),{
        locales: ["pt-BR"],
        name: "test"
      });
      var Document = TestUtils.renderIntoDocument(Page);

      form.updateState('presets', ['1', '2', '3', '4']);
      form.updateField('amount', '1');
      function onFieldUpdated(e) {
        var detail = e.detail;
        var value = detail.value;
        if (detail.field === "amount") {
          listener.off('fieldUpdated', onFieldUpdated);
          React.unmountComponentAtNode(Document.getDOMNode().parentNode);
          should(value).equal('2');
        }
      }
      listener.on('fieldUpdated', onFieldUpdated);
      form.updateState('presets', ['2', '3', '4', '5']);
    });
  });
  it('switching presets should keep other amount', function() {
    should.doesNotThrow(() => {
      var TestInput = stubContext(AmountButtons, IntlContext);
      var Page = React.createElement(stubContext(TestInput, IntlContext),{
        locales: ["pt-BR"],
        name: "test"
      });
      var Document = TestUtils.renderIntoDocument(Page);

      form.updateState('presets', ['1', '2', '3', '4']);

      var testElement = Document.getDOMNode().querySelector('#amount-other-input');
      form.updateField('amount', '5');
      TestUtils.Simulate.change(testElement);
      form.updateState('presets', ['2', '3', '4', '5']);
      var value = testElement.value;
      React.unmountComponentAtNode(Document.getDOMNode().parentNode);
      should(value).equal('5');
    });
  });
});
