import React from 'react';
import {FormattedMessage, IntlMixin, FormattedNumber} from 'react-intl';

module.exports = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    if (this.props.amount) {
      return (
        <FormattedMessage
          message={this.getIntlMessage('donate_now_amount')}
          donationAmount={
            <FormattedNumber
              maximumFractionDigits={2}
              value={this.props.amount}
              style="currency"
              currency={this.props.currency || "usd"}
            />
          }
        />
      );
    } else {
      return (
        <span>{this.getIntlMessage("donate_now")}</span>
      );
    }
  }
});
