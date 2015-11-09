// this will ignore that Bad Invocation error which is a bug in JSXHint
/* jshint -W067 */

import React from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import Signup from '../components/signup.jsx';
import SignupTest from '../components/signup-test.jsx';
import Social from '../components/social.jsx';
import SocialTest from '../components/social-test.jsx';
import ThankYouHeader from '../components/thank-you-header.jsx';
import { FormattedHTMLMessage, IntlMixin } from 'react-intl';
import analytics from '../public/js/analytics.js';
import form from '../scripts/form.js';

var ThankYou = React.createClass({
  mixins: [IntlMixin],
  componentDidMount: function() {
    form.updateField("email", this.props.email || "");
    analytics();
  },
  renderBaseline: function() {
    var locale = this.props.locales[0];
    return (
      <span className="base-line-thank-you">
        <Header>
          <h1>{ this.getIntlMessage("from_all_of_us_at_mozilla") }</h1>
          <h2>
            <FormattedHTMLMessage
              message={ this.getIntlMessage("thank_you_for_your_donation") }
            />
          </h2>
        </Header>
        <div>
          {this.props.params && ['de', 'en-US'].indexOf(locale) !== -1 ? <Signup country={this.props.country} email={this.props.email} locales={this.props.locales}/> : <Social language={locale}/> }
          <Footer/>
        </div>
      </span>
    );
  },
  renderNewFlow: function() {
    var locale = this.props.locales[0];
    return (
      <span className="new-flow-thank-you">
        <ThankYouHeader/>
        <div>
          {this.props.params && ['de', 'en-US'].indexOf(locale) !== -1 ? <SignupTest country={this.props.country} email={this.props.email} locales={this.props.locales}/> : <SocialTest language={locale}/> }
          <Footer/>
        </div>
      </span>
    );
  },
  render: function() {
    var className = "row";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div>
        <div className={className}>
          {this.renderBaseline()}
          {this.renderNewFlow()}
        </div>
      </div>
    );
  }
});

module.exports = ThankYou;
