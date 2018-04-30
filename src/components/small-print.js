import React from 'react';
import Link from './link.js';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';

var Footer = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    var wireTransferLink = (<Link to={'/' + this.context.intl.locale + '/ways-to-give#wire'}>{this.context.intl.formatMessage({id: 'wireTransfer'})}</Link>);
    var bitcoinLink = (<Link to={'/' + this.context.intl.locale + '/give-bitcoin/'}>{this.context.intl.formatMessage({id: 'Bitcoin'})}</Link>);
    var checkLink = (<a href={'/' + this.context.intl.locale + '/ways-to-give#check'}>{this.context.intl.formatMessage({id: 'check'})}</a>);

    var donationNotice = "donation_notice";
    if (/^(en)(\b|$)/.test(this.context.intl.locale)) {
      donationNotice = "donation_notice_2"
    }

    return (
      <div className="row disclaimers">
        <p className="other-ways-to-give">
          <FormattedMessage
            id='other_way_to_give_wire_check'
            values={{
              wireTransferLink,
              checkLink
            }}
          />
        </p>
        <p className="need-help">
          <FormattedHTMLMessage id="problems_donating"/>
        </p>
        <p className="donation-notice">
          {this.context.intl.formatMessage({id: donationNotice})}
        </p>
      </div>
    );
  }
});

module.exports = Footer;
