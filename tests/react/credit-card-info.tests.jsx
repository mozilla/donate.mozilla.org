var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var should = require('should');
var IntlContext =
  {
    messages: {
      credit_card_number: 'cc number',
      credit_card_expiration_month: 'cc month',
      credit_card_expiration_year: 'cc year',
      MM: 'MM',
      YY: 'YY',
      CVC: 'CVC',
      cvc_info: 'cvc info'
    }
  };
var stubContext = require('react-test-context');
var CrediCardInfo = require('../../components/credit-card-info.jsx');


function SetupCCInfoComponent(testCase) {
  var CrediCardInfoInputs = stubContext(CrediCardInfo, IntlContext);
  var el = TestUtils.renderIntoDocument(React.createElement(stubContext(CrediCardInfoInputs, IntlContext),{error:{}, onChange: function(){}}));
  var CCNumInput = el.getDOMNode().querySelector('input[name="cc_number"]');
  CCNumInput.value = testCase.ccNum;
  TestUtils.Simulate.change(CCNumInput);
  var CCMMInput = el.getDOMNode().querySelector('input[name="cc_expir_month"]');
  CCMMInput.value = testCase.CCMM;
  TestUtils.Simulate.change(CCMMInput);
  var CCYYInput = el.getDOMNode().querySelector('input[name="cc_expir_year"]');
  CCYYInput.value = testCase.CCYY;
  TestUtils.Simulate.change(CCYYInput);
  var CCCVVInput = el.getDOMNode().querySelector('input[name="cc_cvv"]');
  CCCVVInput.value = testCase.CCCVV;
  TestUtils.Simulate.change(CCCVVInput);
  should(el.refs.baseElement.refs.baseElement.validate()).equal(testCase.result);
}

describe('credit-card-info.jsx', function () {

  it('should require a field props', function () {
    should.throws(() => {
      TestUtils.renderIntoDocument(React.createElement(stubContext(CrediCardInfo, IntlContext)));
    });
  });
  it('should throw when passing wrong prop types', function () {
    should.throws(() => {
      TestUtils.renderIntoDocument(React.createElement(stubContext(CrediCardInfo, IntlContext),{error:'error', onChange: function(){}}));
    });
  });
  it('should not throw when passing all props', function () {
    should.doesNotThrow(() => {
      TestUtils.renderIntoDocument(React.createElement(stubContext(CrediCardInfo, IntlContext),{error:{}, onChange: function(){}}));
    });
  });
  it('.validate() should return false when all fields are empty', function () {
    should.doesNotThrow(() => {
      var CrediCardInfoInputs = stubContext(CrediCardInfo, IntlContext);
      var el = TestUtils.renderIntoDocument(React.createElement(stubContext(CrediCardInfoInputs, IntlContext),{error:{}, onChange: function(){}}));
      should(el.refs.baseElement.refs.baseElement.validate()).equal(false);
    });
  });
  it('.validate() should return true when all fields are filled', function () {
    should.doesNotThrow(() => {
      SetupCCInfoComponent({
        ccNum: "4242424242424242", CCMM: "02", CCYY: "19", CCCVV: "141", result: true
      });
    });
  });
  it('.validate() should return false when input invalid credit card nunber', function () {
    should.doesNotThrow(() => {
      SetupCCInfoComponent({
        ccNum: "1242424242424242", CCMM: "02", CCYY: "19", CCCVV: "141", result: false
      });
    });
  });
  it('.validate() should return false when input whitespaces for credit card number', function () {
    should.doesNotThrow(() => {
      SetupCCInfoComponent({
        ccNum: "   ", CCMM: "02", CCYY: "19", CCCVV: "141", result: false
      });
    });
  });
  it('.validate() should return false when using expired card', function () {
    should.doesNotThrow(() => {
      SetupCCInfoComponent({
        ccNum: "4242424242424242", CCMM: "02", CCYY: "14", CCCVV: "141", result: false
      });
    });
  });
  it('.validate() should return false when giving empty CVV number', function () {
    should.doesNotThrow(() => {
      SetupCCInfoComponent({
        ccNum: "4242424242424242", CCMM: "02", CCYY: "19", CCCVV: " ", result: false
      });
    });
  });
  it('.validate() should return false when input undefined CVV number', function () {
    should.doesNotThrow(() => {
      SetupCCInfoComponent({
        ccNum: "4242424242424242", CCMM: "02", CCYY: "19", CCCVV: undefined, result: false
      });
    });
  });
  it('.validate() should return true for mastercard number', function () {
    should.doesNotThrow(() => {
      SetupCCInfoComponent({
        ccNum: "5160777788787747", CCMM: "02", CCYY: "19", CCCVV: "141", result: true
      });
    });
  });
  it('.validate() should return true for amex number', function () {
    should.doesNotThrow(() => {
      SetupCCInfoComponent({
        ccNum: "378282246310005", CCMM: "02", CCYY: "19", CCCVV: "121", result: true
      });
    });
  });
  it('.validate() should return false for invalid CVV for amex number', function () {
    should.doesNotThrow(() => {
      SetupCCInfoComponent({
        ccNum: "378282246310005", CCMM: "02", CCYY: "19", CCCVV: "11", result: false
      });
    });
  });
});
