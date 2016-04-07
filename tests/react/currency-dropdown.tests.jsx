var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var should = require('should');
var stubContext = require('react-test-context');
var CurrencyDropdown = require('../../components/currency-dropdown.jsx');
var listener = require('../../scripts/listener.js');

describe('currency-dropdown.jsx', function() {
  it('stateUpdated should contain cad data when currency dropdown changes to cad', function() {
    should.doesNotThrow(() => {
      var TestInput = stubContext(CurrencyDropdown, {});
      var Page = React.createElement(stubContext(TestInput, {}));
      var Document = TestUtils.renderIntoDocument(Page);

      function onStateUpdated(e) {
        listener.off('stateUpdated', onStateUpdated);
        should(e.detail.value.code).equal('cad');
      }
      listener.on('stateUpdated', onStateUpdated);

      var testElement = Document.getDOMNode();
      testElement.value = "cad";
      TestUtils.Simulate.change(testElement);
    });
  });

  it('stateUpdated should contain brl data when currency dropdown changes to brl', function() {
    should.doesNotThrow(() => {
      var TestInput = stubContext(CurrencyDropdown, {});
      var Page = React.createElement(stubContext(TestInput, {}));
      var Document = TestUtils.renderIntoDocument(Page);

      function onStateUpdated(e) {
        listener.off('stateUpdated', onStateUpdated);
        should(e.detail.value.code).equal('brl');
      }
      listener.on('stateUpdated', onStateUpdated);

      var testElement = Document.getDOMNode();
      testElement.value = "brl";
      TestUtils.Simulate.change(testElement);
    });
  });

  it('stateUpdated should contain usd data when currency dropdown changes to usd', function() {
    should.doesNotThrow(() => {
      var TestInput = stubContext(CurrencyDropdown, {});
      var Page = React.createElement(stubContext(TestInput, {}));
      var Document = TestUtils.renderIntoDocument(Page);

      function onStateUpdated(e) {
        listener.off('stateUpdated', onStateUpdated);
        should(e.detail.value.code).equal('usd');
      }
      listener.on('stateUpdated', onStateUpdated);

      var testElement = Document.getDOMNode();
      testElement.value = "usd";
      TestUtils.Simulate.change(testElement);
    });
  });

  it('stateUpdated should contain eur data when currency dropdown changes to eur', function() {
    should.doesNotThrow(() => {
      var TestInput = stubContext(CurrencyDropdown, {});
      var Page = React.createElement(stubContext(TestInput, {}));
      var Document = TestUtils.renderIntoDocument(Page);

      function onStateUpdated(e) {
        listener.off('stateUpdated', onStateUpdated);
        should(e.detail.value.code).equal('eur');
      }
      listener.on('stateUpdated', onStateUpdated);

      var testElement = Document.getDOMNode();
      testElement.value = "eur";
      TestUtils.Simulate.change(testElement);
    });
  });

  it('stateUpdated should default to usd data when currency dropdown changes to empty string', function() {
    should.doesNotThrow(() => {
      var TestInput = stubContext(CurrencyDropdown, {});
      var Page = React.createElement(stubContext(TestInput, {}));
      var Document = TestUtils.renderIntoDocument(Page);

      function onStateUpdated(e) {
        listener.off('stateUpdated', onStateUpdated);
        should(e.detail.value.code).equal('usd');
      }
      listener.on('stateUpdated', onStateUpdated);

      var testElement = Document.getDOMNode();
      testElement.value = "";
      TestUtils.Simulate.change(testElement);
    });
  });

  it('stateUpdated should default to usd data when currency dropdown changes to nonsense', function() {
    should.doesNotThrow(() => {
      var TestInput = stubContext(CurrencyDropdown, {});
      var Page = React.createElement(stubContext(TestInput, {}));
      var Document = TestUtils.renderIntoDocument(Page);

      function onStateUpdated(e) {
        listener.off('stateUpdated', onStateUpdated);
        should(e.detail.value.code).equal('usd');
      }
      listener.on('stateUpdated', onStateUpdated);

      var testElement = Document.getDOMNode();
      testElement.value = "nonsense";
      TestUtils.Simulate.change(testElement);
    });
  });
});
