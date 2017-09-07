/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-disable no-unused-vars */

var should = require('should');
var ContextStub = require('./context-stub.jsx');

import { mount } from 'enzyme';
var createTestStore = require('./test-store.js');
var DonationPage = require('../../dist/pages/one-page.js');

describe('donation page query ?amount=101&currency=aud&presets=1,2,3,4&frequency=monthly donation test', function() {
  should.doesNotThrow(() => {

    var store = createTestStore({
      amount: "101",
      presets: ["1", "2", "3", "4"],
      frequency: "monthly",
      currency: {
        code: 'aud',
        minAmount: '2',
        symbol: '$',
        presets: {
          single: ['200', '150', '100', '50'],
          monthly: ['50', '40', '30', '20']
        }
      }
    });

    var wrapper = mount(
      <ContextStub store={store}>
        <DonationPage/>
      </ContextStub>
    );

    var testElement = wrapper.getDOMNode();
    var amountOther = testElement.querySelector('#amount-other-input').value;
    var currencySelector = testElement.querySelector('.currency-dropdown').value;
    var aboutPresetButton1 = testElement.querySelector('#amount-1').value;
    var aboutPresetButton2 = testElement.querySelector('#amount-2').value;
    var aboutPresetButton3 = testElement.querySelector('#amount-3').value;
    var aboutPresetButton4 = testElement.querySelector('#amount-4').value;
    var frequency = testElement.querySelector('.monthly-payment').checked;

    it('#amount-other-input value is 101', function() {
      should(amountOther).equal('101');
    });
    it('.currency-dropdown value is aud', function() {
      should(currencySelector).equal('aud');
    });
    it('preset #amount-1 value 1', function() {
      should(aboutPresetButton1).equal('1');
    });
    it('preset #amount-2 value 2', function() {
      should(aboutPresetButton2).equal('2');
    });
    it('preset #amount-3 value 3', function() {
      should(aboutPresetButton3).equal('3');
    });
    it('preset #amount-4 value 4', function() {
      should(aboutPresetButton4).equal('4');
    });
    it('frequency .monthly-payment checked is true', function() {
      should(frequency).equal(true);
    });
  });
});
