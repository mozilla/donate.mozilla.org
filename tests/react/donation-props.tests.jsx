/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-disable no-unused-vars */
var ReactDOM = require('react-dom');
var TestUtils = require('react/lib/ReactTestUtils');
var should = require('should');
var ContextStub = require('./ContextStub.jsx');
var DonationPage = require('../../dist/pages/one-page.js');

describe('donation page query ?amount=100&currency=cad&presets=1,2,3,4&frequency=monthly donation test', function() {
  should.doesNotThrow(() => {
    var Document = TestUtils.renderIntoDocument(
      <ContextStub>
        <DonationPage
          amount="100"  
          presets={["1", "2", "3", "4"]}
          frequency="monthly"
          currency={{
            code: 'aud',
            minAmount: '2',
            symbol: '$',
            presets: {
              single: ['200', '150', '100', '50'],
              monthly: ['50', '40', '30', '20']
            }
          }}
        />
      </ContextStub>
    );
    
    var testElement = ReactDOM.findDOMNode(Document);
    var amountOther = testElement.querySelector('#amount-other-input').value;
    var currencySelector = testElement.querySelector('.currency-dropdown').value;
    var aboutPresetButton1 = testElement.querySelector('#amount-1').value;
    var aboutPresetButton2 = testElement.querySelector('#amount-2').value;
    var aboutPresetButton3 = testElement.querySelector('#amount-3').value;
    var aboutPresetButton4 = testElement.querySelector('#amount-4').value;
    var frequency = testElement.querySelector('.monthly-payment').checked;

    it('#amount-other-input value is 100', function() {
      should(amountOther).equal('100');
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
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(Document).parentNode);
  });
});
