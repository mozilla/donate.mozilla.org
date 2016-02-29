var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react/lib/ReactTestUtils');
var should = require('should');
var IntlProvider = require('react-intl').IntlProvider;

var IntlContext = { locale: 'en-US', messages: {'please_complete': 'please_complete', 'country': 'c', 'address': 'a', city: 'c', postal_code: 'p', 'state_province': 's'} };
var {Address, Code, City} = require('../../components/address-input.jsx');

describe('address-input.jsx {Address, Code, City}', function() {
  var form;
  beforeEach(function() {
    form = require('../../scripts/form.js');
  });
  [Address, Code, City].forEach(function(Item) {
    it('.validate() should return true when all fields are filled', function() {
      should.doesNotThrow(() => {
        var Document = TestUtils.renderIntoDocument(<IntlProvider {...IntlContext} ><Item name="test"/></IntlProvider>);

        var testElement = ReactDOM.findDOMNode(Document);
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

        var testElement = ReactDOM.findDOMNode(Document);
        testElement.value = "  ";
        TestUtils.Simulate.change(testElement);

        should(form.validate(["test"])).equal(false);
      });
    });
  });
});
