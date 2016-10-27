import React from 'react';
import { connect } from 'react-redux';
import { setPrivacyPolicy } from '../actions'; 
import Checkbox from './checkbox.js';

var PrivacyPolicyCheckbox = React.createClass({
  propTypes: {
    error: React.PropTypes.string
  },
  onChange: function(e) {
    this.props.setPrivacyPolicy(e.currentTarget.checked);
  },
  render: function() {
    return (
      <Checkbox
        {...this.props}
        error={this.props.privacyPolicyError}
        onChange={this.onChange}
        checked={this.props.privacyPolicy}
        intlId={this.props.intlId || "privacy_policy"}
        id="privacy-policy-checkbox"
        name="legal_confirm"
      />
    );
  }
});

module.exports = connect(
function(state) {
  return {
    privacyPolicy: state.signupForm.privacyPolicy,
    privacyPolicyError: state.signupForm.privacyPolicyError
  };
},
function(dispatch) {
  return {
    setPrivacyPolicy: function(data) {
      dispatch(setPrivacyPolicy(data));
    }
  };
})(PrivacyPolicyCheckbox);
