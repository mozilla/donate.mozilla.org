import React from 'react';
import Email from './email-input.js';
import {PrivacyPolicyCheckbox} from './checkbox.js';
import {Country} from './address-input.js';
import SubmitButton from './submit-button.js';

var SIGNUP_SUBMITTING = 1;

var Signup = React.createClass({
  mixins: [require('../mixins/form.js')],
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    return (
      <div>
        <div className="container">
          <div className="wrap">
            <div className="row">
              <h3>{this.context.intl.formatMessage({id: 'working_hard_to_protect_the_web'})}</h3>
            </div>
          </div>
          <div className="wrap">
            <div className="row">
              <Email name="email"/>
              <div className="full country-signup">
                <Country name="country"/>
              </div>
              <PrivacyPolicyCheckbox name="privacyPolicy"/>
              <div className="no-country-signup">
                <SubmitButton
                  submitting={this.state.submitting === SIGNUP_SUBMITTING}
                  validate={["email", "privacyPolicy"]}
                  onSubmit={this.signup}
                  submit={["email"]}
                  errors={["email"]}
                >
                  {this.context.intl.formatMessage({id: 'sign_up_now'})}
                </SubmitButton>
              </div>
              <div className="country-signup">
                <SubmitButton
                  submitting={this.state.submitting === SIGNUP_SUBMITTING}
                  validate={["email", "privacyPolicy"]}
                  onSubmit={this.signup}
                  submit={["email", "country"]}
                  errors={["email", "country"]}
                >
                  {this.context.intl.formatMessage({id: 'sign_up_now'})}
                </SubmitButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Signup;
