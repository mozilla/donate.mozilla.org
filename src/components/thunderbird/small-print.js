import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';

var Footer = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    return (
      <div className="row disclaimers">
        <p className="need-help">
          <FormattedHTMLMessage id="problems_donating_thunderbird" />
        </p>
        <p className="donation-notice">
          {this.context.intl.formatMessage({id: 'donation_notice_thunderbird'})}
        </p>
      </div>
    );
  }
});

module.exports = Footer;
