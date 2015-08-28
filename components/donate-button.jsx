import React from 'react';
import {FormattedMessage, IntlMixin, FormattedNumber} from 'react-intl';

var DonateButton = React.createClass({
  mixins: [IntlMixin],
  onClick: function() {
    this.props.onSubmit(this.props.validate, this.props.submit);
  },
  render: function() {
    var message = this.getIntlMessage("donate_now");
    return (
      <div className="row">
        <div className="full">
          <button onClick={this.onClick} type="submit" className="btn large-label-size" id="donate-btn">
            { this.props.amount ?
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
              /> : message}
          </button>
        </div>
      </div>
    );
  }
});

module.exports = DonateButton;
