import React from 'react';
import Link from './../link.js';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';

var Footer = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    var wireTransferLink = (<Link to={'/' + this.context.intl.locale + '/thunderbird/faq#item_2'}>{this.context.intl.formatMessage({id: 'wireTransfer'})}</Link>);
    var checkLink = (<a href={'/' + this.context.intl.locale + '/thunderbird/faq#item_4'}>{this.context.intl.formatMessage({id: 'check'})}</a>);
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
          <FormattedHTMLMessage id="problems_donating_thunderbird2"/>
        </p>
        <p className="donation-notice">
          {this.context.intl.formatMessage({id: 'donation_notice_thunderbird'})}
        </p>
      </div>
    );
  }
});

module.exports = Footer;
