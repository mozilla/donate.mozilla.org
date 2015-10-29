var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var should = require('should');
var IntlContext = { messages: {'country': 'c', 'address': 'a', city: 'c', postal_code: 'p', 'state_province': 's'} };
var stubContext = require('react-test-context');
var {Address, Code, City} = require('../../components/address-input.jsx');

describe('address-input.jsx {Address, Code, City}', function() {
  var items = [Address, Code, City];
  items.forEach(function(Item) {
    it('should require a field props', function() {
      should.throws(() => {
        TestUtils.renderIntoDocument(React.createElement(stubContext(Item, IntlContext)));
      });
    });
    it('should throw when passing wrong prop types', function() {
      should.throws(() => {
        TestUtils.renderIntoDocument(React.createElement(stubContext(Item, IntlContext),{onChange: ""}));
      });
    });
    it('should not throw when passing all props', function() {
      should.doesNotThrow(() => {
        TestUtils.renderIntoDocument(React.createElement(stubContext(Item, IntlContext),{onChange: function() {}}));
      });
    });
    it('.validate() should return false when all fields are empty', function() {
      should.doesNotThrow(() => {
        var Element = stubContext(Item, IntlContext);
        var Input;
        TestUtils.renderIntoDocument(React.createElement(stubContext(Element, IntlContext),{
          onChange: function(name, input) {
            Input = input;
          }
        }));
        should(Input.validate()).equal(false);
      });
    });
    it('.validate() should return false when all fields are whitespace', function() {
      should.doesNotThrow(() => {
        var Element = stubContext(Item, IntlContext);
        var Input;
        TestUtils.renderIntoDocument(React.createElement(stubContext(Element, IntlContext),{
          onChange: function(name, input) {
            Input = input;
          },
          value: " "
        }));
        should(Input.validate()).equal(false);
      });
    });
    it('.validate() should return true when all fields are filled', function() {
      should.doesNotThrow(() => {
        var Element = stubContext(Item, IntlContext);
        var Input;
        TestUtils.renderIntoDocument(React.createElement(stubContext(Element, IntlContext),{
          onChange: function(name, input) {
            Input = input;
          },
          value: "test"
        }));
        should(Input.validate()).equal(true);
      });
    });
  });
});
