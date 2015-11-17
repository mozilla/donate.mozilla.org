var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var should = require('should');
var IntlContext = { messages: {'please_complete': 'please_complete', 'country': 'c', 'address': 'a', city: 'c', postal_code: 'p', 'state_province': 's'} };
var stubContext = require('react-test-context');
var {Address, Code, City} = require('../../components/address-input.jsx');

describe('address-input.jsx {Address, Code, City}', function() {
  var form;
  beforeEach(function() {
    form = require('../../scripts/form.js');
  });
  [Address, Code, City].forEach(function(Item) {
    it('.validate() should return true when all fields are filled', function() {
      should.doesNotThrow(() => {
        var TestInput = stubContext(Item, IntlContext);
        var Page = React.createElement(stubContext(TestInput, IntlContext),{
          name: "test"
        });
        var Document = TestUtils.renderIntoDocument(Page);

        var testElement = Document.getDOMNode();
        testElement.value = "testValue";
        TestUtils.Simulate.change(testElement);

        should(form.validate(["test"])).equal(true);
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

        var testElement = Document.getDOMNode();
        testElement.value = "  ";
        TestUtils.Simulate.change(testElement);

        should(form.validate(["test"])).equal(false);
      });
    });
  });
});
