import React from 'react';
import Link from './link.jsx';
import { FormattedHTMLMessage, FormattedMessage, IntlMixin } from 'react-intl';

var Footer = React.createClass({
  propTypes: {
    locale: React.PropTypes.string.isRequired
  },
  mixins: [IntlMixin],
  render: function() {
    var bitcoinLink = (<Link to={'/' + this.props.locale + '/give-bitcoin/'}>{this.getIntlMessage('Bitcoin')}</Link>);
    var checkLink = (<a target='_blank' href='https://wiki.mozilla.org/Ways_to_Give#Check_.28via_postal_service.29'>{this.getIntlMessage('check')}</a>);
    var stripeNotice = "stripe-notice";
    if (!this.props.stripeNotice) {
      stripeNotice += " hidden";
    }
    return (
      <div className="row disclaimers">
        <p className="other-ways-to-give">
            <FormattedMessage message={this.getIntlMessage('other_way_to_give')}
            bitcoinLink={bitcoinLink}
            checkLink={checkLink}/>
        </p>
        <p className="need-help">
          <FormattedHTMLMessage message={ this.getIntlMessage("problems_donating") } />
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
