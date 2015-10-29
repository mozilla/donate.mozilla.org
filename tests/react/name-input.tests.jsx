var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var should = require('should');
var IntlContext = { messages: {'first_name': 'first name', 'last_name': 'last name'} };
var stubContext = require('react-test-context');
var {FirstName, LastName} = require('../../components/name-input.jsx');
import listener from '../../scripts/listener.js';

describe('name-input.jsx {FirstName, LastName}', function() {
  var items = [FirstName, LastName];
  items.forEach(function(Item) {
    it('.validate() should return false when all fields are empty', function() {
      should.doesNotThrow(() => {
        var Element = stubContext(Item, IntlContext);
        listener.on("fieldReady", function(e) {
          should(e.detail.element.validate()).equal(false);
        });
        TestUtils.renderIntoDocument(React.createElement(stubContext(Element, IntlContext)));
      });
    });
    it('.validate() should return false when all fields are whitespace', function() {
      should.doesNotThrow(() => {
        var Element = stubContext(Item, IntlContext);
        listener.on("fieldReady", function(e) {
          should(e.detail.element.validate()).equal(false);
        });
        TestUtils.renderIntoDocument(React.createElement(stubContext(Element, IntlContext),{
          value: " "
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
          value: "test"
        }));
      });
    });
  });
});
