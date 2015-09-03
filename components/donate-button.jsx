import React from 'react';
import {FormattedMessage, IntlMixin, FormattedNumber} from 'react-intl';

var ButtonContent = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    if (this.props.submitting) {
      return (
        <span><i className="fa fa-cog fa-spin"/>{this.getIntlMessage('submitting')}</span>
      );
    } else if (this.props.amount) {
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

var DonateButton = React.createClass({
  mixins: [IntlMixin],
  onClick: function() {
    this.props.onSubmit(this.props.validate, this.props.submit);
  },
  render: function() {
    var errorMessageClassName = "row error-msg-row";
    var errorMessage = this.props.error.message;
    if (errorMessage === "") {
      errorMessageClassName += " hidden";
    }
    return (
      <div className="row">
        <div className="full">
          <button onClick={this.onClick} type="submit" className="btn large-label-size" id="donate-btn">
            <ButtonContent
              amount={this.props.amount}
              submitting={this.props.submitting}
              currency={this.props.currency}
            />
          </button>
        </div>
        <div className={errorMessageClassName}>
          <div className="full">
            <div id="amount-error-msg">
              <ul id="parsley-id-multiple-donation_amount" className="parsley-errors-list filled">
                <li className="parsley-custom-error-message">
                  {errorMessage}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = DonateButton;
