import React from 'react';
import Modal from '../components/modal.js';
import amountModifier from '../lib/amount-modifier.js';
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
    let trueAmount = amountModifier.reverse(
      query.str_amount,
      query.payment.toLowerCase(),
      currencyCode
    );
    inputValue = suggestMonthly(trueAmount);

    return ({
      inputValue,
      amount: inputValue
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
        inputValue: inputValue
      });
    }
    this.setState({amount});
  },
  submit: function() {
    submit("/api/stripe-monthly-upsell", {}, function(response) {
      
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
    // Pull this into a shared function.
    /*var errorMessage = "";
    var amount = parseInt(this.props.amount, 10);
    var minAmount = parseInt(this.props.currency.minAmount, 10);
    if (!amount) {
      errorMessage = 'please_select_an_amount';
    } else if (amount < minAmount) {
      errorMessage = 'donation_min_error';
    }
    if (errorMessage) {
      this.props.setAmountError(errorMessage);
      return false;
    }*/
    return true;
  },
  render: function() {
    return (
      <div className="upsell-container">
        <Modal>
          <div className="upsell-modal">
            <p className="upsell-ask">
              {/*Fix currency symbol*/}
              Add a $<input value={this.state.inputValue} onChange={this.onInputChange}/> monthly donation starting next month?
            </p>
            <button onClick={this.submit} className="yes-button">YES</button>
            <button onClick={this.props.onClose} className="no-button">NO</button>
          </div>
        </Modal>
      </div>
    );
  }
});

module.exports = MonthlyUpsell;
