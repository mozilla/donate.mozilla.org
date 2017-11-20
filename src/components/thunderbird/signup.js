import React from 'react';
import Email from '../email-input.js';
import PrivacyPolicyCheckbox from '../privacy-checkbox.js';
import SubmitButton from '../submit-button.js';
import ErrorMessage from '../error.js';
import { connect } from 'react-redux';
import { setEmailError, setPrivacyPolicyError } from '../../actions';

var NOT_SUBMITTING = 0;
var SIGNUP_SUBMITTING = 1;

var Signup = React.createClass({
  mixins: [require('../../mixins/mailchimp.js')],
  contextTypes: {
    intl: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      signupError: "",
      submitting: NOT_SUBMITTING
    };
  },
  signup: function() {
    var valid = true;

    if (!this.props.email.trim()) {
      valid = false;
      this.props.setEmailError(this.context.intl.formatMessage({id: "please_complete"}));
    } else if (!this.emailInput.getWrappedInstance().inputElement.validity.valid) {
      valid = false;
      this.props.setEmailError(this.context.intl.formatMessage({id: "email_invalid"}));
    }
    if (!this.props.privacyPolicy) {
      valid = false;
      this.props.setPrivacyPolicyError(this.context.intl.formatMessage({id: "pp_acknowledge"}));
    }

    if (valid) {
      this.mailchimp({
        email: this.props.email
      });
    }
  },
  render: function() {
    return (
      <div>
        <div className="container">
          <div className="wrap">
            <div className="row">
              <h3>{this.context.intl.formatMessage({id: 'sign_up_thunderbird'})}</h3>
            </div>
          </div>
          <div className="wrap">
            <div className="row">
              <Email ref={(input) => { this.emailInput = input; }}/>
              <PrivacyPolicyCheckbox intlId='privacy_policy_thunderbird'/>
              <div className="row submit-button">
                <div className="full submit-button-container">
                  <ErrorMessage message={this.state.signupError}/>
                  <SubmitButton
                    submitting={this.state.submitting === SIGNUP_SUBMITTING}
                    onSubmit={this.signup}
                  >
                    {this.context.intl.formatMessage({id: 'sign_up_now'})}
                  </SubmitButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = connect(
  function(state) {
    return {
      email: state.signupForm.email,
      privacyPolicy: state.signupForm.privacyPolicy
    };
  },
  function(dispatch) {
    return {
      setEmailError: function(data) {
        dispatch(setEmailError(data));
      },
      setPrivacyPolicyError: function(data) {
        dispatch(setPrivacyPolicyError(data));
      }
    };
  })(Signup);
