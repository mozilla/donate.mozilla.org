var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var should = require('should');
var IntlContext = { messages: {'first_name': 'first name', 'last_name': 'last name'} };
var stubContext = require('react-test-context');
var {FirstName, LastName} = require('../../components/name-input.jsx');
var items = [FirstName, LastName];

describe('name-input.jsx {FirstName, LastName}', function() {
  var form;
  beforeEach(function() {
    form = require('../../scripts/form.js');
  });
  items.forEach(function(Item) {
    it('.validate() should return true when all fields are filled', function() {
      should.doesNotThrow(() => {
        var TestInput = stubContext(Item, IntlContext);
        var Page = React.createElement(stubContext(TestInput, IntlContext),{
          name: "test"
        });
        var Document = TestUtils.renderIntoDocument(Page);

        var testElement = Document.getDOMNode().querySelector('input[name="test"]');
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

        var testElement = Document.getDOMNode().querySelector('input[name="test"]');
        testElement.value = "  ";
        TestUtils.Simulate.change(testElement);

        should(form.validate(["test"])).equal(false);
      });
    });
  });
});
