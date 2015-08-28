import React from 'react';
import {IntlMixin, FormattedNumber} from 'react-intl';

var AmountButton = React.createClass({
  render: function() {
    var checked = false;
    if (this.props.value === this.props.amount) {
      checked = true;
    }

    return (
      <div className="third">
        <input onChange={this.props.onChange} checked={checked} type="radio" name="donation_amount" value={this.props.value} id={"amount-" + this.props.value}/>
        <label htmlFor={"amount-" + this.props.value} className="large-label-size">
          <FormattedNumber
            minimumFractionDigits={0}
            value={this.props.value}
            style="currency"
            currency={this.props.currency || "usd"}
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
  render: function() {
    return (
      <div className="two-third">
        <div id="amount-other-container">
          <input id="amount-other" type="radio" name="donation_amount"
            checked={this.props.checked}
            onClick={this.onRadioClick}
            onChange={this.props.onRadioChange}
            value={this.props.amount}
          />
          <label htmlFor="amount-other" className="large-label-size">$</label>
          <input id="amount-other-input" className="medium-label-size" type="text"
            onChange={this.props.onInputChange}
            value={this.props.amount}
            onClick={this.onInputClick}
            placeholder={this.props.placeholder}
          />
        </div>
      </div>
    );
  }
});

var AmountButtons = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  getInitialState: function() {
    var presets = this.props.presets || "";
    presets = presets.split(",");
    if (presets.length !== 4) {
      presets = ["20", "10", "5", "3"];
    }
    var amount = this.props.amount;
    var preset = presets.indexOf(amount);
    var userInputting = false;
    if (preset < 0 && amount) {
      userInputting = true;
    }
    return {
      presets: presets,
      userInputting: userInputting,
      values: {
        amount: amount || "",
        currencyCode: this.props.currency
      },
      valid: true
    };
  },
  onChange: function(e) {
    this.setAmount(e.currentTarget.value, false);
  },
  setAmount: function(amount, userInputting) {
    var values = this.state.values;
    values.amount = amount;
    this.setState({
      userInputting: userInputting,
      valid: true,
      values: values
    });
    this.props.onChange(this.props.name, this);
  },
  otherRadioChange: function() {
    if (!this.state.userInputting) {
      this.setAmount("", true);
    }
  },
  otherInputChange: function(e) {
    var newAmount = e.currentTarget.value;
    if (/^(\d)*[\.]?(\d){0,2}$/.test(newAmount)) {
      this.setAmount(newAmount, true);
    }
  },
  validate: function() {
    var valid = false;
    if (this.state.values.amount) {
      valid = true;
    }
    this.setState({
      valid: valid
    });
    return valid;
  },
  componentDidMount: function() {
    this.props.onChange(this.props.name, this);
  },
  render: function() {
    var otherAmount = "";
    var amount = this.state.values.amount;
    var preset = this.state.presets.indexOf(amount);
    var userInputting = this.state.userInputting;
    if (userInputting) {
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
          <AmountButton value={this.state.presets[0]} currency={currency} amount={amount}
            onChange={this.onChange}/>
          <AmountButton value={this.state.presets[1]} currency={currency} amount={amount}
            onChange={this.onChange}/>
          <AmountButton value={this.state.presets[2]} currency={currency} amount={amount}
            onChange={this.onChange}/>
        </div>
        <div className="row donation-amount-row">
          <AmountButton value={this.state.presets[3]} currency={currency} amount={amount}
            onChange={this.onChange}/>
          <AmountOtherButton amount={otherAmount}
            checked={userInputting} currency={currency}
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
                  {this.getIntlMessage('please_select_an_amount')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = AmountButtons;

