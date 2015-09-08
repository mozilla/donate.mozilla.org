import React from 'react';
import IntlMixin from 'react-intl';
import Email from '../components/email-input.jsx';
import PrivacyPolicy from '../components/privacy-policy-input.jsx';
import SubmitButton from '../components/submit-button.jsx';

var Form = React.createClass({
  mixins: [IntlMixin, require('../mixins/form.jsx')],
  render: function() {
    return (
      <div>
        <div className="form-wrapper container">
          <div className="wrap">
            <div className="row">
              <h2>{this.getIntlMessage('sign_up_for_email')}</h2>
              <h5>
                {this.getIntlMessage('dont_miss_important_news')}
              </h5>
            </div>
          </div>
          <div className="wrap">
            <div className="row">
              <Email onChange={this.onChange} name="email"/>
              <PrivacyPolicy onChange={this.onChange} name="privacyPolicy"/>
              <SubmitButton
                submitting={this.state.submitting}
                validate={["email", "privacyPolicy"]}
                onSubmit={this.signup}
                submit={["email"]}
                error={this.state.errors.other}
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
