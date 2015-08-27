import React from 'react';
import Link from './link.jsx';
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
        <p className="other_ways_to_give">
          <small>
            Other ways to give: <Link to='give-bitcoin'>{this.getIntlMessage('Bitcoin')}</Link> |
            <a target='_blank' href='https://wiki.mozilla.org/Ways_to_Give#Check_.28via_postal_service.29'>Check</a>
          </small>
        </p>
        <p className="need-help">
          <small><FormattedHTMLMessage message={ this.getIntlMessage("problems_donating") } />
            </small>
        </p>
        <p className="donation-notice">
          <small>{this.getIntlMessage('donation_notice')}</small>
        </p>
        <p className={stripeNotice}>
          <small><FormattedHTMLMessage message={ this.getIntlMessage("stripe_notice") } /></small>
        </p>
      </div>
    )
  }
});

module.exports = Footer;
