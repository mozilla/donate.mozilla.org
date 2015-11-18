var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var should = require('should');
var IntlContext = { messages: {'donation_min_error': 'donation_min_error', 'please_select_an_amount': 'please_select_an_amount', 'other_amount': 'other_amount'} };
var stubContext = require('react-test-context');
var AmountButtons = require('../../components/amount-buttons.jsx');

describe('amount-buttons.jsx', function() {
  var form;
  beforeEach(function() {
    form = require('../../scripts/form.js');
  });
  it('AmountButtons should select the right button after amount, frequency, currency, and presets are provided', function() {
    should.doesNotThrow(() => {
      var TestInput = stubContext(AmountButtons, IntlContext);
      var Page = React.createElement(stubContext(TestInput, IntlContext),{
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
});
