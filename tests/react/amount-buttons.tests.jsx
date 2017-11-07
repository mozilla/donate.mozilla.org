/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-disable no-unused-vars */

import { mount } from 'enzyme';
var should = require('should');
var ContextStub = require('./context-stub.jsx');
var AmountButtons = require('../../dist/components/amount-buttons.js');
var createTestStore = require('./test-store.js');
import { setCurrency, setFrequency, setAmount } from '../../src/actions/';

import {addLocaleData} from 'react-intl';
import ptBRLocaleData from 'react-intl/locale-data/pt';
addLocaleData(ptBRLocaleData);

describe('amount-buttons.jsx', function() {
  it('AmountButtons should select the right button after amount, frequency, currency, and presets are provided', function() {
    should.doesNotThrow(() => {
      var store = createTestStore();

      var wrapper = mount(
        <ContextStub store={store}>
          <AmountButtons
            presets={["1","2","3","4"]}
          />
        </ContextStub>
      );

      store.dispatch(setCurrency({
        code: 'dkk',
        minAmount: '12',
        symbol: 'kr',
        paypalFixedFee: {
          macro: 2.60,
          micro: 0.43
        },
        presets: {
          single: ['160', '80', '40', '20'],
          monthly: ['60', '30', '20', '15']
        }
      }));
      store.dispatch(setFrequency("monthly"));
      store.dispatch(setAmount("60"));
      var checked = wrapper.getDOMNode().querySelector("#amount-60").checked;

      should(checked).equal(true);
    });
  });
  it('setAmount to 42 should set other input value to 42', function() {
    should.doesNotThrow(() => {
      var store = createTestStore();

      var wrapper = mount(
        <ContextStub store={store}>
          <AmountButtons/>
        </ContextStub>
      );
      store.dispatch(setAmount("42"));
      var value = wrapper.getDOMNode().querySelector("#amount-other-input").value;

      should(value).equal('42');
    });
  });
  it('currency updates should clear selected amount', function() {
    should.doesNotThrow(() => {

      var store = createTestStore();

      var wrapper = mount(
        <ContextStub store={store}>
          <AmountButtons/>
        </ContextStub>
      );

      var otherInput = wrapper.find("#amount-other-input");
      otherInput.get(0).value = '123';
      otherInput.simulate("change");

      store.dispatch(setCurrency({
        code: 'dkk',
        minAmount: '12',
        symbol: 'kr',
        paypalFixedFee: {
          macro: 2.60,
          micro: 0.43
        },
        presets: {
          single: ['160', '80', '40', '20'],
          monthly: ['60', '30', '20', '15']
        }
      }));

      should(otherInput.get(0).value).equal('');
    });
  });
  it('other input should show commas in pt-BR for initial values', function() {
    should.doesNotThrow(() => {

      var store = createTestStore();
      var wrapper = mount(
        <ContextStub locale="pt-BR" store={store}>
          <AmountButtons/>
        </ContextStub>
      );

      store.dispatch(setAmount("2000.99"));
      var otherInput = wrapper.find("#amount-other-input");
      should(otherInput.get(0).value).equal('2.000,99');
    });
  });
  function numberFormatTest(locale, testValue, expects) {
    it(locale + ' with ' + testValue + ' should be ' + expects, function() {
      should.doesNotThrow(() => {

        var store = createTestStore();
        var wrapper = mount(
          <ContextStub locale={locale} store={store}>
            <AmountButtons/>
          </ContextStub>
        );

        var otherInput = wrapper.find("#amount-other-input");
        otherInput.get(0).value = testValue;
        otherInput.simulate("change");

        var amountValue = store.getState().donateForm.amount;
        should(amountValue).equal(expects);
      });
    });
  }
  numberFormatTest('en-US', '1,001.23', '1001.23');
  numberFormatTest('en-US', '1.001,23', '1001.23');
  numberFormatTest('pt-BR', '1,001.23', '1001.23');
  numberFormatTest('pt-BR', '1.001,23', '1001.23');

  numberFormatTest('en-US', '1,00,1.23', '1001.23');
  numberFormatTest('en-US', '1.00.1,23', '1001.23');
  numberFormatTest('pt-BR', '1,00,1.23', '1001.23');
  numberFormatTest('pt-BR', '1.00.1,23', '1001.23');

  numberFormatTest('en-US', '1,10', '1.10');
  numberFormatTest('en-US', '1.10', '1.10');
  numberFormatTest('pt-BR', '1,10', '1.10');
  numberFormatTest('pt-BR', '1.10', '1.10');

  numberFormatTest('en-US', '110,50', '110.50');
  numberFormatTest('en-US', '110.50', '110.50');
  numberFormatTest('pt-BR', '110,50', '110.50');
  numberFormatTest('pt-BR', '110.50', '110.50');

  numberFormatTest('en-US', '110,504', '110504');
  numberFormatTest('en-US', '110.504', '110504');
  numberFormatTest('pt-BR', '110,504', '110504');
  numberFormatTest('pt-BR', '110.504', '110504');
  it('switching frequency should keep selected position, and not amount', function() {
    should.doesNotThrow(() => {

      var store = createTestStore({amount: '25'});
      var wrapper = mount(
        <ContextStub store={store}>
          <AmountButtons/>
        </ContextStub>
      );

      var firstInput = wrapper.find("#amount-25");
      store.dispatch(setFrequency('monthly'));
      should(firstInput.get(0).value).equal('5');
    });
  });
  it('switching frequency should keep other amount selected', function() {
    should.doesNotThrow(() => {

      var store = createTestStore({amount: '42'});
      var wrapper = mount(
        <ContextStub store={store}>
          <AmountButtons/>
        </ContextStub>
      );

      store.dispatch(setFrequency('monthly'));

      var value = wrapper.getDOMNode().querySelector("#amount-other-input").value;
      should(value).equal('42');
    });
  });
});
