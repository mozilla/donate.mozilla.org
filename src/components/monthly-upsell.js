import React from 'react';
import Modal from '../components/modal.js';
import amountModifier from '../lib/amount-modifier.js';
import currencyData from '../data/currencies.js';
import submit from '../lib/submit';

function suggestMonthly(amount) {
  // TODO: refine this function to actually do what
  // we want it to do based on the amount donated,
  // and the numbers we came up with.
  return (1.5 * parseInt(amount, 10)/12) + "";
}

var MonthlyUpsell = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  getInitialState: function() {
    var inputValue = "";
    let query = this.props.query;
    let currencyCode = query.str_currency;
    let customerId = query.customer_id;
    let trueAmount = amountModifier.reverse(
      query.str_amount,
      query.payment.toLowerCase(),
      currencyCode
    );
    inputValue = suggestMonthly(trueAmount);

    return ({
      inputValue,
      amount: inputValue,
      currencyCode,
      customerId,
      amountError: ""
    });
  },
  onInputChange: function(e) {
    var inputValue = e.currentTarget.value;
    var amount = "";

    // Pull this into a shared function.
    if (/^[\d]*[\.]?\d{0,2}$/.test(inputValue)) {
      amount = inputValue.replace(/,/g, "");
    } else if (/^[\d]*[,]?\d{0,2}$/.test(inputValue)) {
      amount = inputValue.replace(/\./g, "").replace(",", ".");
    } else if (/^[\d,]*[\.]?\d{0,2}$/.test(inputValue)) {
      amount = inputValue.replace(/,/g, "");
    } else if (/^[\d\.]*[,]?\d{0,2}$/.test(inputValue)) {
      amount = inputValue.replace(/\./g, "").replace(",", ".");
    } else {
      inputValue = this.state.inputValue;
    }

    if (this.state.inputValue !== inputValue) {
      this.setState({
        inputValue: inputValue,
        amountError: ""
      });
    }
    this.setState({amount});
  },
  submit: function() {
    let currencyCode = this.state.currencyCode;

    if (!this.validateAmount()) {
      return;
    }

    submit("/api/stripe-monthly-upsell", {
      customerId: this.state.customerId,
      currency: this.state.currencyCode,
      amount: amountModifier.stripe(this.state.inputValue, currencyCode),
      locale: this.context.intl.locale,
      description: this.context.intl.formatMessage({id: "mozilla_monthly_donation"})
    }, (response) => {
      // Handle success.
      console.log(response, "success");
      window.location = '/' + this.context.intl.locale + '/' + 'thank-you' + '/';
    }, function(response) {
      // Handle errors.
      if (response.stripe) {
        //error(response.stripe.rawType);
      } else {
        //error(response.error);
      }
    });
  },
  validateAmount: function() {
    var currency = currencyData[this.state.currencyCode];
    var amount = parseInt(this.state.inputValue, 10);
    var minAmount = parseInt(currency.minAmount, 10);

    var errorMessage = "";
    if (!amount) {
      errorMessage = 'please_select_an_amount';
    } else if (amount < minAmount) {
      errorMessage = 'donation_min_error';
    }
    if (errorMessage) {
      this.setState({
        amountError: errorMessage
      });
      return false;
    }
    return true;
  },
  render: function() {
    var currency = currencyData[this.state.currencyCode];
    var currencySymbol = currency.symbol;
    var amountError = this.state.amountError;
    // Display amount error and server errors.
    var amountErrorElement = null;
    if (amountError) {
      amountErrorElement = (
        <div>amountError</div>
      );
    }
    return (
      <div className="upsell-container">
        <Modal>
          <div className="upsell-modal">
            <p className="upsell-ask">
              Add a {currencySymbol} <input value={this.state.inputValue} onChange={this.onInputChange}/> monthly donation starting next month?
            </p>
            {amountErrorElement}
            <button onClick={this.submit} className="yes-button">YES</button>
            <button onClick={this.props.onClose} className="no-button">NO</button>
          </div>
        </Modal>
      </div>
    );
  }
});

module.exports = MonthlyUpsell;
