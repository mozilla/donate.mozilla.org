import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react/lib/ReactTestUtils';
import should from 'should';
import {IntlProvider} from 'react-intl';
import AmountButtons from '../../components/amount-buttons.jsx';
import listener from '../../scripts/listener.js';
import {addLocaleData} from 'react-intl';
import ptBRLocaleData from 'react-intl/locale-data/pt';
addLocaleData(ptBRLocaleData);

var IntlContext = { locale: 'en-US', messages: {'other_amount': 'other_amount', 'donation_min_error': 'c'} };

describe('amount-buttons.jsx', function() {
  var form;
  beforeEach(function() {
    form = require('../../scripts/form.js');
  });
  it('AmountButtons should select the right button after amount, frequency, currency, and presets are provided', function() {
    should.doesNotThrow(() => {
      var Document = TestUtils.renderIntoDocument(<IntlProvider {...IntlContext} ><AmountButtons name="test"/></IntlProvider>);

      form.updateState('presets', ["1","2","3","4"]);
      form.updateState('currency', {
        code: 'dkk',
        minAmount: '12',
        symbol: 'kr',
        presets: {
          single: ['1000', '500', '250', '150'],
          monthly: ['150', '100', '75', '50']
        }
      });
      form.updateField('frequency', 'monthly');
      form.updateField('amount', '150');

      var testElement = ReactDOM.findDOMNode(Document).querySelector('#amount-150');
      var checked = testElement.checked;
      ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(Document).parentNode);
      should(checked).equal(true);
    });
  });
  it('form.updateField amount to 42 should set other input value to 42', function() {
    should.doesNotThrow(() => {

      var Document = TestUtils.renderIntoDocument(<IntlProvider {...IntlContext} ><AmountButtons name="test"/></IntlProvider>);

      form.updateField('amount', '42');
      var testElement = ReactDOM.findDOMNode(Document).querySelector('#amount-other-input');
      var value = testElement.value;
      ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(Document).parentNode);
      should(value).equal('42');
    });
  });
  it('currency updates should clear selected amount', function() {
    should.doesNotThrow(() => {
      var Document = TestUtils.renderIntoDocument(<IntlProvider {...IntlContext} ><AmountButtons name="test"/></IntlProvider>);

      var testElement = ReactDOM.findDOMNode(Document).querySelector('#amount-other-input');
      testElement.value = '123';
      TestUtils.Simulate.change(testElement);
      form.updateState('currency', {
        code: 'dkk',
        minAmount: '12',
        symbol: 'kr',
        presets: {
          single: ['1000', '500', '250', '150'],
          monthly: ['150', '100', '75', '50']
        }
      });
      var value = testElement.value;
      ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(Document).parentNode);
      should(value).equal('');
    });
  });
  it('other input should show commas in pt-BR for initial values', function() {
    should.doesNotThrow(() => {
      var IntlContext = { locale: 'pt-BR', messages: {'other_amount': 'other_amount', 'donation_min_error': 'c'} };
      var Document = TestUtils.renderIntoDocument(<IntlProvider {...IntlContext} ><AmountButtons name="test"/></IntlProvider>);
      var testElement = ReactDOM.findDOMNode(Document).querySelector('#amount-other-input');

      form.updateField('amount', '2000.99');
      var value = testElement.value;
      ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(Document).parentNode);
      should(value).equal('2.000,99');
    });
  });
  function numberFormatTest(locale, testValue, expects) {
    it(locale + ' with ' + testValue + ' should be ' + expects, function() {
      should.doesNotThrow(() => {
        var IntlContext = { locale: locale, messages: {'other_amount': 'other_amount', 'donation_min_error': 'c'} };
        var Document = TestUtils.renderIntoDocument(<IntlProvider {...IntlContext} ><AmountButtons name="test"/></IntlProvider>);

        function onFieldUpdated(e) {
          var detail = e.detail;
          var value = detail.value;
          if (detail.field === "amount") {
            listener.off('fieldUpdated', onFieldUpdated);
            ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(Document).parentNode);
            should(value).equal(expects);
          }
        }
        listener.on('fieldUpdated', onFieldUpdated);

        var testElement = ReactDOM.findDOMNode(Document).querySelector('#amount-other-input');
        testElement.value = testValue;
        TestUtils.Simulate.change(testElement);
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
  it('switching presets should keep preset position', function() {
    should.doesNotThrow(() => {
      var Document = TestUtils.renderIntoDocument(<IntlProvider {...IntlContext} ><AmountButtons name="test"/></IntlProvider>);

      form.updateState('presets', ['1', '2', '3', '4']);
      form.updateField('amount', '1');
      function onFieldUpdated(e) {
        var detail = e.detail;
        var value = detail.value;
        if (detail.field === "amount") {
          listener.off('fieldUpdated', onFieldUpdated);
          ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(Document).parentNode);
          should(value).equal('2');
        }
      }
      listener.on('fieldUpdated', onFieldUpdated);
      form.updateState('presets', ['2', '3', '4', '5'] );
    });
  });
  it('switching presets should keep other amount', function() {
    should.doesNotThrow(() => {

      var Document = TestUtils.renderIntoDocument(<IntlProvider {...IntlContext} ><AmountButtons name="test"/></IntlProvider>);

      form.updateState('presets', ['1', '2', '3', '4']);

      var testElement = ReactDOM.findDOMNode(Document).querySelector('#amount-other-input');
      form.updateField('amount', '5');
      TestUtils.Simulate.change(testElement);
      form.updateState('presets', ['2', '3', '4', '5']);
      var value = testElement.value;
      ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(Document).parentNode);
      should(value).equal('5');
    });
  });
});
