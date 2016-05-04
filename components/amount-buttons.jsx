import React from 'react';
import {FormattedMessage, FormattedNumber} from 'react-intl';
import {ErrorMessage} from './error.jsx';
import listener from '../scripts/listener.js';
import form from '../scripts/form.js';

var AmountButton = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func,
    amount: React.PropTypes.string,
    value: React.PropTypes.string,
    currencyCode: React.PropTypes.string
  },
  render: function() {
    var checked = false;
    if (this.props.value === this.props.amount) {
      checked = true;
    }
    return (
      <div className="third">
        <input onChange={this.props.onChange} checked={checked} className="amount-radio" type="radio" name="donation_amount" value={this.props.value} id={"amount-" + this.props.value}/>
        <label htmlFor={"amount-" + this.props.value} className="amount-button large-label-size">
          { this.props.currencyCode && this.props.value ?
          <FormattedNumber
            minimumFractionDigits={0}
            value={this.props.value}
            style="currency"
            currency={this.props.currencyCode}
          /> : <span>&nbsp;</span> }
        </label>
      </div>
    );
  }
});

var AmountOtherButton = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  propTypes: {
    checked: React.PropTypes.bool.isRequired,
    onRadioChange: React.PropTypes.func,
    onInputChange: React.PropTypes.func,
    amount: React.PropTypes.string,
    currencySymbol: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    userInputting: React.PropTypes.bool
  },
  getInitialState: function() {
    return {
      inputValue: "",
      decimalCurrency: this.testNumberFormat()
    };
  },
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
  testNumberFormat: function() {
    return this.context.intl.formatNumber("1.50").indexOf(",") === -1;
  },
  onInputChange: function(e) {
    var inputValue = e.currentTarget.value;
    var amount = "";

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
      this.props.onInputChange(amount);
    }
  },
  render: function() {
    var amount = this.props.amount;
    var inputValue = this.state.inputValue;
    if (!amount) {
      inputValue = "";
    } else if (!this.props.userInputting) {
      // We only need this for initial display before the user starts inputting,
      // once they start inputting, we can adapt.
      inputValue = this.context.intl.formatNumber(amount);
    }
    return (
      <div className="two-third">
        <div className="amount-other-container">
          <input id="amount-other" type="radio" name="donation_amount"
            checked={this.props.checked}
            onClick={this.onRadioClick}
            onChange={this.onRadioChange}
            value={amount}
          />
          <label htmlFor="amount-other" className="large-label-size">
            <span className="currency-symbol-container">
              { this.props.currencySymbol ?
                <span>{this.props.currencySymbol}</span> :
                <span>&nbsp;</span>
              }
            </span>
          </label>
          <div className="amount-other-wrapper">
            <input id="amount-other-input" className="medium-label-size" type="text"
              onChange={this.onInputChange}
              value={inputValue}
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
  contextTypes: {
    intl: React.PropTypes.object
  },
  propTypes: {
    name: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      // userInputting is used to override checked amount
      // buttons while the user is entering an other amount.
      userInputting: false,
      valid: true,
      errorMessage: "",
      amount: "",
      currency: {},
      frequency: "",
      presets: []
    };
  },
  onChange: function(e) {
    this.setAmount(e.currentTarget.value, false);
  },
  setAmount: function(amount, userInputting) {
    this.setState({
      userInputting: userInputting,
      valid: true,
      errorMessage: ""
    });
    form.updateField("amount", amount);
  },
  otherRadioChange: function() {
    this.setAmount("", true);
  },
  otherInputChange: function(newAmount) {
    this.setAmount(newAmount, true);
  },
  validate: function() {
    var valid = false;
    var errorMessage = "";
    if (this.state.amount) {
      if (parseInt(this.state.amount, 10) < parseInt(this.state.currency.minAmount, 10)) {
        errorMessage = 'donation_min_error';
      } else {
        valid = true;
      }
    } else {
      errorMessage = 'please_select_an_amount';
    }
    this.setState({
      valid: valid,
      errorMessage: errorMessage
    });
    return valid;
  },
  renderErrorMessage: function() {
    if (this.state.errorMessage === 'donation_min_error') {
      return (
        <FormattedMessage
          id={this.state.errorMessage}
          values={{minAmount:
            <span>
              { this.state.currency.code ?
              <FormattedNumber
                maximumFractionDigits={2}
                value={this.state.currency.minAmount}
                style="currency"
                currency={this.state.currency.code}
              /> : "" }
            </span>
          }}
        />
      );
    }
    if (this.state.errorMessage) {
      return this.context.intl.formatMessage({id: this.state.errorMessage});
    }
    return "";
  },
  componentDidMount: function() {
    listener.on("fieldUpdated", this.onFieldUpdated);
    listener.on("stateUpdated", this.onStateUpdated);
    form.registerField({
      name: this.props.name,
      element: this,
      field: "amount"
    });
  },
  componentWillUnmount: function() {
    listener.off("fieldUpdated", this.onFieldUpdated);
    listener.off("stateUpdated", this.onStateUpdated);
  },
  onFieldUpdated: function(e) {
    var detail = e.detail;
    var field = detail.field;
    var value = detail.value;
    if (field === "amount") {
      this.setState({
        amount: value
      });
    }
    if (field === "frequency") {
      this.setState({
        frequency: value
      });
      if (this.state.currency.presets) {
        form.updateState("presets", this.state.currency.presets[value]);
      }
    }
  },
  onCurrencyChange: function(value) {
    this.setState({
      currency: value
    });
    if (this.state.frequency) {
      form.updateState("presets", value.presets[this.state.frequency]);
    }
    form.updateField("amount", "");
  },
  onPresetsChange: function(value) {
    var selectedIndex = this.state.presets.indexOf(this.state.amount);
    var newAmount = value[selectedIndex];
    this.setState({
      presets: value
    });
    if (newAmount && !this.state.userInputting) {
      form.updateField("amount", newAmount);
    }
  },
  onStateUpdated: function(e) {
    var detail = e.detail;
    var state = detail.state;
    var value = detail.value;
    if (state === "currency") {
      this.onCurrencyChange(value);
    }
    if (state === "presets") {
      this.onPresetsChange(value);
    }
  },
  render: function() {
    var otherAmount = "";
    var amount = this.state.amount;
    var presets = this.state.presets;
    var preset = presets.indexOf(amount);
    var userInputting = this.state.userInputting;
    var otherChecked = userInputting || !!(amount && preset < 0);

    if (otherChecked) {
      otherAmount = amount;
      amount = "";
    }
    var errorMessageClassName = "row error-msg-row";
    if (this.state.valid) {
      errorMessageClassName += " hidden";
    }
    var currency = this.state.currency;
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
            userInputting={userInputting}
            checked={otherChecked}
            onRadioChange={this.otherRadioChange}
            onInputChange={this.otherInputChange}
            placeholder={this.context.intl.formatMessage({id: 'other_amount'})}
          />
        </div>
        <ErrorMessage message={this.renderErrorMessage()}/>
      </div>
    );
  }
});

module.exports = AmountButtons;
