var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var should = require('should');
var IntlContext =
  {
    messages: {
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
import listener from '../../scripts/listener.js';

describe('credit-card-info.jsx {CardNumber, CardCvc, CardExpMonth, CardExpYear}', function() {
  var items = [CardNumber, CardCvc, CardExpMonth, CardExpYear];

  items.forEach(function(Item) {
    it('.validate() should return false when all fields are empty', function() {
      should.doesNotThrow(() => {
        var Element = stubContext(Item, IntlContext);
        listener.on("fieldReady", function(e) {
          should(e.detail.element.validate()).equal(false);
        });
        TestUtils.renderIntoDocument(React.createElement(stubContext(Element, IntlContext),{
          name: "test"
        }));
      });
    });
    it('.validate() should return false when all fields are whitespace', function() {
      should.doesNotThrow(() => {
        var Element = stubContext(Item, IntlContext);
        listener.on("fieldReady", function(e) {
          should(e.detail.element.validate()).equal(false);
        });
        TestUtils.renderIntoDocument(React.createElement(stubContext(Element, IntlContext),{
          value: " ",
          name: "test"
        }));
      });
    });
    it('.validate() should return true when all fields are filled', function() {
      should.doesNotThrow(() => {
        var Element = stubContext(Item, IntlContext);
        listener.on("fieldReady", function(e) {
          should(e.detail.element.validate()).equal(true);
        });
        TestUtils.renderIntoDocument(React.createElement(stubContext(Element, IntlContext),{
          value: "test",
          name: "test"
        }));
      });
    });
  });
});
