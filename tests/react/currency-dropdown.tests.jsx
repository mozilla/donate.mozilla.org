var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react/lib/ReactTestUtils');
var should = require('should');
var CurrencyDropdown = require('../../components/currency-dropdown.jsx');
var listener = require('../../scripts/listener.js');
var IntlProvider = require('react-intl').IntlProvider;
var IntlContext = {locale: 'en-US'};

describe('currency-dropdown.jsx', function() {
  it('stateUpdated should contain cad data when currency dropdown changes to cad', function() {
    should.doesNotThrow(() => {
      var Document = TestUtils.renderIntoDocument(<IntlProvider {...IntlContext}><CurrencyDropdown/></IntlProvider>);

      function onStateUpdated(e) {
        listener.off('stateUpdated', onStateUpdated);
        should(e.detail.value.code).equal('cad');
      }
      listener.on('stateUpdated', onStateUpdated);

      var testElement = ReactDOM.findDOMNode(Document);
      testElement.value = "cad";
      TestUtils.Simulate.change(testElement);
    });
  });

  it('stateUpdated should contain brl data when currency dropdown changes to brl', function() {
    should.doesNotThrow(() => {
      var Document = TestUtils.renderIntoDocument(<IntlProvider {...IntlContext}><CurrencyDropdown/></IntlProvider>);

      function onStateUpdated(e) {
        listener.off('stateUpdated', onStateUpdated);
        should(e.detail.value.code).equal('brl');
      }
      listener.on('stateUpdated', onStateUpdated);

      var testElement = ReactDOM.findDOMNode(Document);
      testElement.value = "brl";
      TestUtils.Simulate.change(testElement);
    });
  });

  it('stateUpdated should contain usd data when currency dropdown changes to usd', function() {
    should.doesNotThrow(() => {
      var Document = TestUtils.renderIntoDocument(<IntlProvider {...IntlContext}><CurrencyDropdown/></IntlProvider>);

      function onStateUpdated(e) {
        listener.off('stateUpdated', onStateUpdated);
        should(e.detail.value.code).equal('usd');
      }
      listener.on('stateUpdated', onStateUpdated);

      var testElement = ReactDOM.findDOMNode(Document);
      testElement.value = "usd";
      TestUtils.Simulate.change(testElement);
    });
  });

  it('stateUpdated should contain eur data when currency dropdown changes to eur', function() {
    should.doesNotThrow(() => {
      var Document = TestUtils.renderIntoDocument(<IntlProvider {...IntlContext}><CurrencyDropdown/></IntlProvider>);

      function onStateUpdated(e) {
        listener.off('stateUpdated', onStateUpdated);
        should(e.detail.value.code).equal('eur');
      }
      listener.on('stateUpdated', onStateUpdated);

      var testElement = ReactDOM.findDOMNode(Document);
      testElement.value = "eur";
      TestUtils.Simulate.change(testElement);
    });
  });

  it('stateUpdated should default to usd data when currency dropdown changes to empty string', function() {
    should.doesNotThrow(() => {
      var Document = TestUtils.renderIntoDocument(<IntlProvider {...IntlContext}><CurrencyDropdown/></IntlProvider>);

      function onStateUpdated(e) {
        listener.off('stateUpdated', onStateUpdated);
        should(e.detail.value.code).equal('usd');
      }
      listener.on('stateUpdated', onStateUpdated);

      var testElement = ReactDOM.findDOMNode(Document);
      testElement.value = "";
      TestUtils.Simulate.change(testElement);
    });
  });

  it('stateUpdated should default to usd data when currency dropdown changes to nonsense', function() {
    should.doesNotThrow(() => {
      var Document = TestUtils.renderIntoDocument(<IntlProvider {...IntlContext}><CurrencyDropdown/></IntlProvider>);

      function onStateUpdated(e) {
        listener.off('stateUpdated', onStateUpdated);
        should(e.detail.value.code).equal('usd');
      }
      listener.on('stateUpdated', onStateUpdated);

      var testElement = ReactDOM.findDOMNode(Document);
      testElement.value = "nonsense";
      TestUtils.Simulate.change(testElement);
    });
  });
});
