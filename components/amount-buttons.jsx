import React from 'react';
import {FormattedMessage, FormattedNumber} from 'react-intl';
import dispatcher from '../scripts/input-dispatcher.js';

var AmountButton = React.createClass({
  render: function() {
    var checked = false;
    if (this.props.value === this.props.amount) {
      checked = true;
    }

    return (
      <div className="third">
        <input onChange={this.props.onChange} checked={checked} className="amount-button" type="radio" name="donation_amount" value={this.props.value} id={"amount-" + this.props.value}/>
        <label htmlFor={"amount-" + this.props.value} className="large-label-size">
          <FormattedNumber
            minimumFractionDigits={0}
            value={this.props.value}
            style="currency"
            currency={this.props.currencyCode || "usd"}
          />
        </label>
      </div>
    );
  }
});

var AmountOtherButton = React.createClass({
  onRadioClick: function() {
    document.querySelector("#amount-other-input").focus();
  },
  onInputClick: function() {
    document.querySelector("#amount-other").click();
  },
  onRadioChange: function() {
    if (!this.props.checked) {
      this.props.onRadioChange();
    }
  },
  render: function() {
    return (
      <div className="two-third">
        <div className="amount-other-container">
          <input id="amount-other" type="radio" name="donation_amount"
            checked={this.props.checked}
            onClick={this.onRadioClick}
            onChange={this.onRadioChange}
            value={this.props.amount}
          />
          <label htmlFor="amount-other" className="large-label-size">
            <span className="currency-symbol-container">{this.props.currencySymbol}</span>
          </label>
          <div className="amount-other-wrapper">
            <input id="amount-other-input" className="medium-label-size" type="text"
              onChange={this.props.onInputChange}
              value={this.props.amount}
              onClick={this.onInputClick}
              placeholder={this.props.placeholder}
            />
          </div>
        </div>
      </div>
    );
  }
});

var AmountButtons = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  getInitialState: function() {
    return {
      // userInputting is used to override checked amount
      // buttons while the user is entering an other amount.
      userInputting: false,
      valid: true,
      errorMessage: ""
    };
  },
  onChange: function(e) {
    this.setAmount(e.currentTarget.value, false);
  },
  setAmount: function(amount, userInputting) {
    this.setState({
      userInputting: userInputting,
      valid: true
    });
    dispatcher.fire("heightChange");
    dispatcher.fieldChange({
      field: "amount",
      value: amount
    });
  },
  otherRadioChange: function() {
    this.setAmount("", true);
  },
  otherInputChange: function(e) {
    var newAmount = e.currentTarget.value;
    if (/^(\d)*[\.]?(\d){0,2}$/.test(newAmount)) {
      this.setAmount(newAmount, true);
    }
  },
  validate: function() {
    var valid = false;
    var errorMessage = "";
    if (this.props.amount) {
      if (parseInt(this.props.amount, 10) < parseInt(this.props.currency.minAmount, 10)) {
        errorMessage = this.getIntlMessage('donation_min_error');
      } else {
        valid = true;
      }
    } else {
      errorMessage = this.getIntlMessage('please_select_an_amount');
    }
    this.setState({
      valid: valid,
      errorMessage: errorMessage
    });
    return valid;
  },
  renderErrorMessage: function() {
    if (this.state.errorMessage === this.getIntlMessage('donation_min_error')) {
      return (
        <FormattedMessage
          message={this.state.errorMessage}
          minAmount={
            <FormattedNumber
              maximumFractionDigits={2}
              value={this.props.currency.minAmount}
              style="currency"
              currency={this.props.currency.code || "usd"}
            />
          }
        />
      );
    }
    return this.state.errorMessage;
  },
  componentDidMount: function() {
    dispatcher.fieldReady({
      name: this.props.name,
      element: this,
      field: "amount"
    });
  },
  render: function() {
    var otherAmount = "";
    var amount = this.props.amount;
    var presets = this.props.presets;
    var preset = presets.indexOf(amount);
    var otherChecked = this.state.userInputting || (amount && preset < 0);
    if (otherChecked) {
      otherAmount = amount;
      amount = "";
    }
    var errorMessageClassName = "row error-msg-row";
    if (this.state.valid) {
      errorMessageClassName += " hidden";
    }
    var currency = this.props.currency;
    return (
      <div className="amount-buttons">
        <div className="row donation-amount-row">
          <AmountButton value={presets[0]} currencyCode={currency.code} amount={amount}
            onChange={this.onChange}/>
          <AmountButton value={presets[1]} currencyCode={currency.code} amount={amount}
            onChange={this.onChange}/>
          <AmountButton value={presets[2]} currencyCode={currency.code} amount={amount}
            onChange={this.onChange}/>
        </div>
        <div className="row donation-amount-row">
          <AmountButton value={presets[3]} currencyCode={currency.code} amount={amount}
            onChange={this.onChange}/>
          <AmountOtherButton amount={otherAmount}
            currencySymbol={currency.symbol}
            checked={otherChecked}
            onRadioChange={this.otherRadioChange}
            onInputChange={this.otherInputChange}
            placeholder={this.getIntlMessage('other_amount')}
          />
        </div>
        <div className={errorMessageClassName}>
          <div className="full">
            <div id="amount-error-msg">
              <ul id="parsley-id-multiple-donation_amount" className="parsley-errors-list filled">
                <li className="parsley-custom-error-message">
                  {this.renderErrorMessage()}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = AmountButtons;
