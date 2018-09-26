import React from 'react';
import Link from './link.js';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';

var Footer = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    var wireTransferLink = (<Link to={'/' + this.context.intl.locale + '/ways-to-give#wire'}>{this.context.intl.formatMessage({id: 'wireTransfer'})}</Link>);
    var checkLink = (<a href={'/' + this.context.intl.locale + '/ways-to-give#check'}>{this.context.intl.formatMessage({id: 'check'})}</a>);
    var privacyPolicyMessage = "privacy_policy_var_b";
    var refundsMessage = "";
    if (this.props.frequency === "monthly") {
      privacyPolicyMessage = "privacy_policy_var_b_monthly";
      refundsMessage = this.context.intl.formatMessage({id: 'privacy_policy_var_b_monthly_refund'});
    }

    return (
      <div className="row disclaimers">
        <p className="full">
          <FormattedHTMLMessage id={privacyPolicyMessage}/>
          {` `}
          <span>{refundsMessage}</span>
          {` `}
          <FormattedMessage
            id='other_way_to_give_wire_check'
            values={{
              wireTransferLink,
              checkLink
            }}
          />
        </p>
        <p className="full need-help">
          <FormattedHTMLMessage id="problems_donating"/>
        </p>
        <p className="full donation-notice">
          {this.context.intl.formatMessage({id: 'donation_notice_2'})}
        </p>
      </div>
    );
  }
});

module.exports = Footer;
