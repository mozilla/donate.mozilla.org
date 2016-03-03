// this will ignore that Bad Invocation error which is a bug in JSXHint
/* jshint -W067 */

import React from 'react';
import ThunderbirdFooter from '../../components/footer-thunderbird.jsx';
import Header from '../../components/header.jsx';
import Signup from '../../components/signup-thunderbird.jsx';
import ThankYouHeader from '../../components/thank-you-header-thunderbird.jsx';
import { FormattedHTMLMessage, IntlMixin } from 'react-intl';
import analytics from '../../assets/js/analytics.js';
import form from '../../scripts/form.js';

var ThankYou = React.createClass({
  mixins: [IntlMixin],
  componentDidMount: function() {
    form.updateField("email", this.props.email || "");
    analytics();
  },
  render: function() {
    var className = "row new-flow-test thunderbird";
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
            <Signup country={this.props.country} email={this.props.email} />
            <ThunderbirdFooter/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ThankYou;
