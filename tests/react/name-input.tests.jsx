var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var should = require('should');
var IntlContext = { messages: {'first_name': 'first name', 'last_name': 'last name'} };
var stubContext = require('react-test-context');
var Name = require('../../components/name-input.jsx');

describe('name-input.jsx', function() {

  it('should require a field props', function() {
    should.throws(() => {
      TestUtils.renderIntoDocument(React.createElement(stubContext(Name, IntlContext)));
    });
  });

  it('should throw when passing wrong prop types', function() {
    should.throws(() => {
      TestUtils.renderIntoDocument(React.createElement(stubContext(Name, IntlContext), {name:'ali', onChange: 'lol'}));
    });
  });

  it('should not throw when passing all props', function() {
    should.doesNotThrow(() => {
      var NameInput = stubContext(Name, IntlContext);
      TestUtils.renderIntoDocument(<NameInput name='name-input' onChange={function() {}} />);
    });
  });
  it('.validate() should return false when first name and last name field are empty', function() {
    should.doesNotThrow(() => {
      var NameInput = stubContext(Name, IntlContext);
      var el = TestUtils.renderIntoDocument(<NameInput name='name-input' onChange={function() {}} />);
      should(el.refs.baseElement.validate()).equal(false);
    });
  });
  it('.validate() should return false when only first name field is filled', function() {
    should.doesNotThrow(() => {
      var NameInput = stubContext(Name, IntlContext);
      var el = TestUtils.renderIntoDocument(<NameInput name='name-input' onChange={function() {}} />);
      var firstName = React.findDOMNode(el.refs.baseElement.refs.firstName);
      firstName.value = 'Ali';
      TestUtils.Simulate.change(firstName);
      should(el.refs.baseElement.validate()).equal(false);
    });
  });
  it('.validate() should return true when first and last name fields are filled', function() {
    should.doesNotThrow(() => {
      var NameInput = stubContext(Name, IntlContext);
      var el = TestUtils.renderIntoDocument(<NameInput name='name-input' onChange={function() {}} />);
      var firstName = React.findDOMNode(el.refs.baseElement.refs.firstName);
      firstName.value = 'Ali';
      TestUtils.Simulate.change(firstName);
      var lastName = React.findDOMNode(el.refs.baseElement.refs.lastName);
      lastName.value = 'Al Dallal';
      TestUtils.Simulate.change(lastName);
      should(el.refs.baseElement.validate()).equal(true);
    });
  });
  it('should error when only whitespace given in the field', function() {
    should.doesNotThrow(() => {
      var NameInput = stubContext(Name, IntlContext);
      var el = TestUtils.renderIntoDocument(<NameInput name='name-input' onChange={function() {}} />);
      var firstName = React.findDOMNode(el.refs.baseElement.refs.firstName);
      firstName.value = '    ';
      TestUtils.Simulate.change(firstName);
      should(el.refs.baseElement.validate()).equal(false);
    });
  });
  it('should have error class when first name is empty', function() {
    should.doesNotThrow(() => {
      var NameInput = stubContext(Name, IntlContext);
      var el = TestUtils.renderIntoDocument(<NameInput name='name-input' onChange={function() {}} />);
      var firstName = React.findDOMNode(el.refs.baseElement.refs.firstName);
      firstName.value = '';
      TestUtils.Simulate.change(firstName);
      el.refs.baseElement.validate();
      should(firstName.className).equal('parsley-error');
    });
  });
});
