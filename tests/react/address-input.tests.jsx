var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var should = require('should');
var IntlContext = { messages: {'country': 'c', 'address': 'a', city: 'c', postal_code: 'p', 'state_province': 's'} };
var stubContext = require('react-test-context');
var {FullAddress} = require('../../components/address-input.jsx');

describe('address-input.jsx', function() {

  it('should require a field props', function() {
    should.throws(() => {
      TestUtils.renderIntoDocument(React.createElement(stubContext(FullAddress, IntlContext)));
    });
  });
  it('should throw when passing wrong prop types', function() {
    should.throws(() => {
      TestUtils.renderIntoDocument(React.createElement(stubContext(FullAddress, IntlContext),{error:'error', onChange: function() {}}));
    });
  });
  it('should not throw when passing all props', function() {
    should.doesNotThrow(() => {
      TestUtils.renderIntoDocument(React.createElement(stubContext(FullAddress, IntlContext),{error:{}, onChange: function() {}}));
    });
  });
  it('.validate() should return false when all fields are empty', function() {
    should.doesNotThrow(() => {
      var AddressInputs = stubContext(FullAddress, IntlContext);
      var el = TestUtils.renderIntoDocument(React.createElement(stubContext(AddressInputs, IntlContext),{error:{}, onChange: function() {}}));
      should(el.refs.baseElement.refs.baseElement.validate()).equal(false);
    });
  });
  it('.validate() should return true when all fields are filled', function() {
    should.doesNotThrow(() => {
      var AddressInputs = stubContext(FullAddress, IntlContext);
      var el = TestUtils.renderIntoDocument(React.createElement(stubContext(AddressInputs, IntlContext),{error:{}, onChange: function() {}}));
      var Address1Input = el.getDOMNode().querySelector('input[name="addr1"]');
      Address1Input.value = "Address 1";
      TestUtils.Simulate.change(Address1Input);
      var CityInput = el.getDOMNode().querySelector('input[name="city"]');
      CityInput.value = "Bangkok";
      TestUtils.Simulate.change(CityInput);
      var ZipInput = el.getDOMNode().querySelector('input[name="zip"]');
      ZipInput.value = "10800";
      TestUtils.Simulate.change(ZipInput);
      var ProvinceSelect = el.getDOMNode().querySelector('select[id="wsstate_cd"]');
      ProvinceSelect.value = "AL";
      TestUtils.Simulate.change(ProvinceSelect);
      should(el.refs.baseElement.refs.baseElement.validate()).equal(true);
    });
  });
  it('.validate() should return false if all field are filled with whitespaces', function() {
    should.doesNotThrow(() => {
      var AddressInputs = stubContext(FullAddress, IntlContext);
      var el = TestUtils.renderIntoDocument(React.createElement(stubContext(AddressInputs, IntlContext),{error:{}, onChange: function() {}}));
      var Address1Input = el.getDOMNode().querySelector('input[name="addr1"]');
      Address1Input.value = "  ";
      TestUtils.Simulate.change(Address1Input);
      var CityInput = el.getDOMNode().querySelector('input[name="city"]');
      CityInput.value = " ";
      TestUtils.Simulate.change(CityInput);
      var ZipInput = el.getDOMNode().querySelector('input[name="zip"]');
      ZipInput.value = undefined;
      TestUtils.Simulate.change(ZipInput);
      var ProvinceSelect = el.getDOMNode().querySelector('select[id="wsstate_cd"]');
      ProvinceSelect.value = "AL";
      TestUtils.Simulate.change(ProvinceSelect);
      should(el.refs.baseElement.refs.baseElement.validate()).equal(false);
    });
  });
});
