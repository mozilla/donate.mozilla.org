import React from 'react';
import Link from './link.jsx';
import { FormattedHTMLMessage, FormattedMessage, IntlMixin } from 'react-intl';

var Footer = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    var bitcoinLink = (<Link to='give-bitcoin'>{this.getIntlMessage('Bitcoin')}</Link>);
    var checkLink = (<a target='_blank' href='https://wiki.mozilla.org/Ways_to_Give#Check_.28via_postal_service.29'>{this.getIntlMessage('check')}</a>);
    var stripeNotice = "stripe-notice";
    if (!this.props.stripeNotice) {
      stripeNotice += " hidden";
    }
    return (
      <div className="row disclaimers">
        <p className="need-help">
          Problems donating? <a href="https://wiki.mozilla.org/Thunderbird/Donate" target="_blank">Visit our FAQ</a> for answers to most common questions. Still have problems? <a href="mailto:thunderbird-donate@mozilla.org">Send us an email</a>.
        </p>
        <p className="donation-notice">
          {this.getIntlMessage('donation_notice')}
        </p>
        <p className={stripeNotice}>
          <FormattedHTMLMessage message={ this.getIntlMessage("stripe_notice") } />
        </p>
      </div>
    );
  }
});

module.exports = Footer;
