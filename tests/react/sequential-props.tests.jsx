var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var should = require('should');
var assign = require('react/lib/Object.assign');
var Context = {
  messages: require('../../locales/en-US.json'),
  router: function() {}
};
assign(Context.router, {
  makeHref: function() {},
  makePath: function() {},
  transitionTo: function() {},
  replaceWith: function() {},
  goBack: function() {},
  getCurrentPath: function() {},
  getCurrentRoutes: function() {},
  getCurrentPathname: function() {},
  getCurrentParams: function() {},
  getCurrentQuery: function() {},
  isActive: function() {},
  render: function() {}
});

var stubContext = require('react-test-context');
var SequentialPage = require('../../pages/sequential.jsx');

describe('sequential page query ?amount=100&currency=cad&presets=1,2,3,4&frequency=monthly sequential test', function() {
  should.doesNotThrow(() => {
    var TestInput = stubContext(SequentialPage, Context);
    var Page = React.createElement(stubContext(TestInput, Context), {
      locales: ['en-US'],
      amount: "100",
      presets: ["1", "2", "3", "4"],
      currency: {
        code: 'aud',
        minAmount: '2',
        symbol: '$',
        presets: {
          single: ['200', '150', '100', '50'],
          monthly: ['50', '40', '30', '20']
        }
      },
      frequency: "monthly",
      country: "GB"
    });
    var Document = TestUtils.renderIntoDocument(Page);
    var testElement = Document.getDOMNode();
    var amountOther = testElement.querySelector('#amount-other-input').value;
    var currencySelector = testElement.querySelector('.currency-dropdown').value;
    var aboutPresetButton1 = testElement.querySelector('#amount-1').value;
    var aboutPresetButton2 = testElement.querySelector('#amount-2').value;
    var aboutPresetButton3 = testElement.querySelector('#amount-3').value;
    var aboutPresetButton4 = testElement.querySelector('#amount-4').value;
    var frequency = testElement.querySelector('.monthly-payment').checked;
    var country = testElement.querySelector('select[name="country"]').value;

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
    it('select[name="country"] value is GB', function() {
      should(country).equal('GB');
    });
    React.unmountComponentAtNode(Document.getDOMNode().parentNode);
  });
});
