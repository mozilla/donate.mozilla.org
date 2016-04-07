import React from 'react';
import { FormattedHTMLMessage, IntlMixin } from 'react-intl';

var Footer = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    var stripeNotice = "stripe-notice";
    if (!this.props.stripeNotice) {
      stripeNotice += " hidden";
    }
    return (
      <div className="row disclaimers">
        <p className="need-help">
          <FormattedHTMLMessage message={ this.getIntlMessage("problems_donating_thunderbird") } />
        </p>
        <p className="donation-notice">
          {this.getIntlMessage('donation_notice_thunderbird')}
        </p>
        <p className={stripeNotice}>
          <FormattedHTMLMessage message={ this.getIntlMessage("stripe_notice") } />
        </p>
      </div>
    );
  }
});

module.exports = Footer;
