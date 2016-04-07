import React from 'react';
import IntlMixin from 'react-intl';
import Email from '../../components/email-input.jsx';
import {PrivacyPolicyCheckbox} from '../../components/checkbox.jsx';
import {Country} from '../../components/address-input.jsx';
import SubmitButton from '../../components/submit-button.jsx';

var Form = React.createClass({
  mixins: [IntlMixin, require('../../mixins/form.jsx')],
  render: function() {
    return (
      <div>
        <div className="container">
          <div className="wrap">
            <div className="row">
              <h3>{this.getIntlMessage('sign_up_thunderbird')}</h3>
            </div>
          </div>
          <div className="wrap">
            <div className="row">
              <Email name="email"/>
              <div className="full country-signup">
                <Country name="country"/>
              </div>
              <PrivacyPolicyCheckbox name="privacyPolicy" message={this.getIntlMessage('privacy_policy_thunderbird')}/>
              <div className="no-country-signup">
                <SubmitButton
                  submitting={this.state.submitting}
                  validate={["email", "privacyPolicy"]}
                  onSubmit={this.mailchimp}
                  submit={["email"]}
                  errors={["email"]}
                >
                  {this.getIntlMessage('sign_up_now')}
                </SubmitButton>
              </div>
              <div className="country-signup">
                <SubmitButton
                  submitting={this.state.submitting}
                  validate={["email", "privacyPolicy"]}
                  onSubmit={this.mailchimp}
                  submit={["email", "country"]}
                  errors={["email", "country"]}
                >
                  {this.getIntlMessage('sign_up_now')}
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
