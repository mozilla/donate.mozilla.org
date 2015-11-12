import React from 'react';
import IntlMixin from 'react-intl';
import Email from '../components/email-input.jsx';
import {PrivacyPolicyCheckbox} from '../components/checkbox.jsx';
import SubmitButton from '../components/submit-button.jsx';

var Form = React.createClass({
  mixins: [IntlMixin, require('../mixins/form.jsx')],
  render: function() {
    return (
      <div>
        <div className="container">
          <div className="wrap">
            <div className="row">
              <h2>{this.getIntlMessage('sign_up_for_email')}</h2>
              <h5>{this.getIntlMessage('dont_miss_important_news')}</h5>
            </div>
          </div>
          <div className="wrap">
            <div className="row">
              <Email name="email"/>
              <PrivacyPolicyCheckbox name="privacyPolicy"/>
              <SubmitButton
                submitting={this.state.submitting}
                validate={["email", "privacyPolicy"]}
                onSubmit={this.signup}
                submit={["email"]}
              >
                {this.getIntlMessage('sign_up_now')}
              </SubmitButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Form;
