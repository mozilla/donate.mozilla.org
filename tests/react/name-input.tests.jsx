/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-disable no-unused-vars */
var ReactDOM = require('react-dom');
var TestUtils = require('react/lib/ReactTestUtils');
var should = require('should');
var IntlStub = require('./IntlStub.jsx');
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
        var Document = TestUtils.renderIntoDocument(<IntlStub><Item name="test"/></IntlStub>);
        var testElement = ReactDOM.findDOMNode(Document).querySelector('input[name="test"]');
        testElement.value = "testValue";
        TestUtils.Simulate.change(testElement);

        should(form.validate(["test"])).equal(true);
      });
    });

    it('.validate() should return false when all fields are empty', function() {
      should.doesNotThrow(() => {
        TestUtils.renderIntoDocument(<IntlStub><Item name="test"/></IntlStub>);
        should(form.validate(["test"])).equal(false);
      });
    });

    it('.validate() should return false when all fields are whitespace', function() {
      should.doesNotThrow(() => {
        var Document = TestUtils.renderIntoDocument(<IntlStub><Item name="test"/></IntlStub>);
        var testElement = ReactDOM.findDOMNode(Document).querySelector('input[name="test"]');
        testElement.value = "  ";
        TestUtils.Simulate.change(testElement);

        should(form.validate(["test"])).equal(false);
      });
    });
  });
});
