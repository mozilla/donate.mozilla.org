import React from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { connect } from 'react-redux';

var DonateButton = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    if (this.props.amount) {
      return (
        <FormattedMessage
          id='donate_now_amount'
          values={{donationAmount:
            <FormattedNumber
              maximumFractionDigits={2}
              value={this.props.amount}
              style="currency"
              currency={this.props.currency.code}
            />
          }}
        />
      );
    }
    return (
      <span>{this.context.intl.formatMessage({id: "donate_now"})}</span>
    );
  }
});

module.exports = connect(
function(state) {
  return {
    amount: state.donateForm.amount,
    currency: state.donateForm.currency
  };
})(DonateButton);
