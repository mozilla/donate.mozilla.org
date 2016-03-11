var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react/lib/ReactTestUtils');
var should = require('should');
var IntlProvider = require('react-intl').IntlProvider;
var IntlContext = { locale: 'en-US', messages: {'please_complete': 'please_complete', 'first_name': 'first name', 'last_name': 'last name'} };
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
        var Document = TestUtils.renderIntoDocument(<IntlProvider {...IntlContext} ><Item name="test"/></IntlProvider>);

        var testElement = ReactDOM.findDOMNode(Document).querySelector('input[name="test"]');
        testElement.value = "testValue";
        TestUtils.Simulate.change(testElement);

        should(form.validate(["test"])).equal(true);
      });
    });

    it('.validate() should return false when all fields are empty', function() {
      should.doesNotThrow(() => {
        TestUtils.renderIntoDocument(<IntlProvider {...IntlContext} ><Item name="test"/></IntlProvider>);
        should(form.validate(["test"])).equal(false);
      });
    });

    it('.validate() should return false when all fields are whitespace', function() {
      should.doesNotThrow(() => {
        var Document = TestUtils.renderIntoDocument(<IntlProvider {...IntlContext} ><Item name="test"/></IntlProvider>);

        var testElement = ReactDOM.findDOMNode(Document).querySelector('input[name="test"]');
        testElement.value = "  ";
        TestUtils.Simulate.change(testElement);

        should(form.validate(["test"])).equal(false);
      });
    });
  });
});
