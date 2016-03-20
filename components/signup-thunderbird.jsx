import React from 'react';
import Email from '../components/email-input.jsx';
import {PrivacyPolicyCheckbox} from '../components/checkbox.jsx';
import {Country} from '../components/address-input.jsx';
import SubmitButton from '../components/submit-button.jsx';

var Form = React.createClass({
  mixins: [require('../mixins/form.jsx')],
  contextTypes: {
    intl: React.PropTypes.object
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
              <Email name="email"/>
              <div className="full country-signup">
                <Country name="country"/>
              </div>
              <PrivacyPolicyCheckbox name="privacyPolicy" intlId="privacy_policy_thunderbird"/>
              <div className="no-country-signup">
                <SubmitButton
                  submitting={this.state.submitting}
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
                  submitting={this.state.submitting}
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

module.exports = Form;
