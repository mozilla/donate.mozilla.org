import React from 'react';
import Link from './link.jsx';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';

module.exports = injectIntl(React.createClass({
  render: function() {
    var bitcoinLink = (<Link to='give-bitcoin'>{this.props.intl.formatMessage({id: 'Bitcoin'})}</Link>);
    var checkLink = (<a target='_blank' href='https://wiki.mozilla.org/Ways_to_Give#Check_.28via_postal_service.29'>{this.props.intl.formatMessage({id: 'check'})}</a>);
    var stripeNotice = "stripe-notice";
    if (!this.props.stripeNotice) {
      stripeNotice += " hidden";
    }
    return (
      <div className="row disclaimers">
        <p className="other-ways-to-give">
            <FormattedHTMLMessage id='other_way_to_give' values={{bitcoinLink, checkLink}}/>
        </p>
        <p className="need-help">
          <FormattedHTMLMessage id="problems_donating" />
        </p>
        <p className="donation-notice">
          {this.props.intl.formatMessage({id: 'donation_notice'})}
        </p>
        <p className={stripeNotice}>
          <FormattedHTMLMessage id="stripe_notice" />
        </p>
      </div>
    );
  }
}));

