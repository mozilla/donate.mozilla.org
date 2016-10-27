/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-disable no-unused-vars */

import { mount } from 'enzyme';
var should = require('should');
var ContextStub = require('./context-stub.jsx');
var createTestStore = require('./test-store.js');
var CurrencyDropdown = require('../../dist/components/currency-dropdown.js');

describe('currency-dropdown.jsx', function() {

  function testCurrency(value, expects) {
    it('currency code should contain ' + expects + ' when currency dropdown changes to ' + value, function() {
      should.doesNotThrow(() => {

        var store = createTestStore();

        var wrapper = mount(
          <ContextStub store={store}>
            <CurrencyDropdown/>
          </ContextStub>
        );

        var currencyDropdown = wrapper.find(".currency-dropdown");
        currencyDropdown.get(0).value = value;
        currencyDropdown.simulate("change");

        should(store.getState().donateForm.currency.code).equal(expects);
      });
    });
  }

  testCurrency("cad", "cad");
  testCurrency("brl", "brl");
  testCurrency("eur", "eur");
  testCurrency("", "usd");
  testCurrency("nonsense", "usd");
});
