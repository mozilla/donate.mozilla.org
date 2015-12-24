// this will ignore that Bad Invocation error which is a bug in JSXHint
/* jshint -W067 */

import React from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import Signup from '../components/signup.jsx';
import Social from '../components/social.jsx';
import ThankYouHeader from '../components/thank-you-header.jsx';
import { FormattedHTMLMessage, IntlMixin } from 'react-intl';
import analytics from '../assets/js/analytics.js';
import form from '../scripts/form.js';
import SubmitButton from '../components/submit-button.jsx';

var DonationMessage = React.createClass({
  mixins: [IntlMixin, require('../mixins/form.jsx')],
  propTypes: { name: React.PropTypes.string.isRequired },
  componentDidMount: function() {
    analytics();
  },
  sendMessage: function() {
    this.setState({submitting: true});
    console.log('sending message');
  },
  render: function() {
    var className = "row new-flow-test";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div>
        <div className="container">
          <div className="row new-flow-thank-you">
            <h2>Send a message to Mozilla with your gift:</h2>
            <textarea className="donation-message-text" defaultValue="Tell us how you really feel"></textarea>
            <SubmitButton
              submitting={this.state.submitting}
              validate={[this.props.name]}
              onSubmit={this.sendMessage}
              submit={[this.props.name]}
            >
            Send Message
            </SubmitButton>
          </div>
          <a className="skip-msg">No thanks.</a>
        </div>
      </div>
    );
  }
});

var ThankYou = React.createClass({
  mixins: [IntlMixin],
  componentDidMount: function() {
    form.updateField("email", this.props.email || "");
    analytics();
  },
  render: function() {
    var className = "row new-flow-test";
    var locale = this.props.locales[0];
    var signUpOrSocial = (<Social language={locale} shouldDisplay={false} />);
    if (this.props.params && /^(en|de)(\b|$)/.test(locale)) {
      signUpOrSocial = (<Signup country={this.props.country} email={this.props.email} locales={this.props.locales} shouldDisplay={false} />);
    }
    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div>
        <div className={className}>
          <span className="base-line-thank-you">
            <Header>
              <h1>{ this.getIntlMessage("from_all_of_us_at_mozilla") }</h1>
              <h2>
                <FormattedHTMLMessage
                  message={ this.getIntlMessage("thank_you_for_your_donation") }
                />
              </h2>
            </Header>
          </span>
          <span className="new-flow-thank-you">
            <ThankYouHeader/>
          </span>
          <div>
            <DonationMessage name="donationMmessage" locales={this.props.locales} country={this.props.country} />
            {signUpOrSocial}
            <Footer/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ThankYou;
