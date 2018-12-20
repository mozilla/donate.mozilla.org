import React from 'react';
import reactGA from 'react-ga';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import ErrorMessage from './error.js';
import { connect } from 'react-redux';
import { setAmount } from '../actions';
import AmountInput from './amount-input.js';

var AmountButton = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },

  propTypes: {
    onChange: React.PropTypes.func,
    amount: React.PropTypes.string,
    value: React.PropTypes.string,
    currencyCode: React.PropTypes.string,
    showMonthlyNote: React.PropTypes.bool
  },

  onClickEvent: function(e) {
    reactGA.event({
      category: "User Flow",
      action: "Changed Amount",
      label: e.currentTarget.value
    });
  },

  renderPerMonthNote: function() {
    if (!this.props.showMonthlyNote) return null;

    return <div className="per-month-note"> {this.context.intl.formatMessage({id: "per_month"})}</div>;
  },

  render: function() {
    var checked = false;
    if (this.props.value === this.props.amount) {
      checked = true;
    }
    return (
      <div className="third">
        <input onChange={this.props.onChange}
          onClick={this.onClickEvent} checked={checked}
          className="amount-radio" type="radio"
          name="donation_amount" value={this.props.value}
          id={"amount-" + this.props.value} autoComplete="off"
        />
        <label htmlFor={"amount-" + this.props.value} className="amount-button large-label-size">
          { this.props.currencyCode && this.props.value ?
            <div>
              <FormattedNumber
                minimumFractionDigits={0}
                value={this.props.value}
                style="currency"
                currency={this.props.currencyCode}
              />
              { this.renderPerMonthNote() }
            </div> : <span>&nbsp;</span> }
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
    placeholder: React.PropTypes.string
  },
  onRadioClick: function() {
    document.querySelector("#amount-other-input").focus();
    reactGA.event({
      category: "User Flow",
      action: "Changed Amount",
      label: "Other"
    });
  },
  onInputClick: function() {
    document.querySelector("#amount-other").click();
  },
  onRadioChange: function() {
    if (!this.props.checked) {
      this.props.onRadioChange();
    }
  },

  renderCurrencySymbol: function() {
    var symbol = <span>&nbsp;</span>;

    if (this.props.currencySymbol) {
      symbol = <div>
        <span>{this.props.currencySymbol}</span>
        { this.props.showMonthlyNote && <div className="per-month-note"> {this.context.intl.formatMessage({id: "per_month"})}</div> }
      </div>;
    }

    return symbol;
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
            autoComplete="off"
          />
          <label htmlFor="amount-other" className="large-label-size">
            <span className="currency-symbol-container">
              { this.renderCurrencySymbol() }
            </span>
          </label>
          <div className="amount-other-wrapper">
            <AmountInput id="amount-other-input"
              className="medium-label-size" type="text"
              onInputChange={this.props.onInputChange}
              amount={this.props.amount}
              onInputClick={this.onInputClick}
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
      userInputting: false
    };
  },
  onChange: function(e) {
    this.setAmount(e.currentTarget.value, false);
  },
  setAmount: function(amount, userInputting) {
    this.setState({
      userInputting: userInputting
    });
    this.props.setAmount(amount);
  },
  otherRadioChange: function() {
    this.setAmount("", true);
  },
  otherInputChange: function(newAmount) {
    this.setAmount(newAmount, true);
  },
  renderErrorMessage: function() {
    if (this.props.amountError === 'donation_min_error') {
      return (
        <FormattedMessage
          id={this.props.amountError}
          values={{minAmount:
            <span>
              { this.props.currency.code ?
                <FormattedNumber
                  maximumFractionDigits={2}
                  value={this.props.currency.minAmount}
                  style="currency"
                  currency={this.props.currency.code}
                /> : "" }
            </span>
          }}
        />
      );
    }
    if (this.props.amountError) {
      return this.context.intl.formatMessage({id: this.props.amountError});
    }
    return "";
  },
  render: function() {
    var otherAmount = "";
    var amount = this.props.amount;
    var presets = this.props.presets;
    var preset = presets.indexOf(amount);
    var frequency = this.props.frequency;
    var userInputting = this.state.userInputting;
    var otherChecked = userInputting || !!(amount && preset < 0);

    if (otherChecked) {
      otherAmount = amount;
      amount = "";
    }

    var currency = this.props.currency;
    var showMonthlyNote;

    if (frequency === `monthly`) {
      showMonthlyNote = true;
    }

    // Test conversion based on donation amount ordering.
    var test = this.props.test;

    if (test && test.indexOf('htl') > -1) {
      // high-to-low presentation
      presets.sort((a,b) => parseFloat(b) - parseFloat(a));
    } else {
      // low-to-high presentation
      presets.sort((a,b) => parseFloat(a) - parseFloat(b));
    }

    return (
      <div className="amount-buttons">
        <div className="row donation-amount-row">
          <AmountButton value={presets[0]} currencyCode={currency.code} amount={amount}
            onChange={this.onChange} showMonthlyNote={showMonthlyNote}/>
          <AmountButton value={presets[1]} currencyCode={currency.code} amount={amount}
            onChange={this.onChange} showMonthlyNote={showMonthlyNote}/>
          <AmountButton value={presets[2]} currencyCode={currency.code} amount={amount}
            onChange={this.onChange} showMonthlyNote={showMonthlyNote}/>
        </div>
        <div className="row donation-amount-row">
          <AmountButton value={presets[3]} currencyCode={currency.code} amount={amount}
            onChange={this.onChange} showMonthlyNote={showMonthlyNote}/>
          <AmountOtherButton amount={otherAmount}
            currencySymbol={currency.symbol}
            checked={otherChecked}
            onRadioChange={this.otherRadioChange}
            onInputChange={this.otherInputChange}
            placeholder={this.context.intl.formatMessage({id: "other_amount"})}
            showMonthlyNote={showMonthlyNote}
          />
        </div>
        <ErrorMessage message={this.renderErrorMessage()}/>
      </div>
    );
  }
});

module.exports = connect(
  function(state) {
    return {
      amount: state.donateForm.amount,
      presets: state.donateForm.presets,
      currency: state.donateForm.currency,
      amountError: state.donateForm.amountError,
      frequency: state.donateForm.frequency
    };
  },
  function(dispatch) {
    return {
      setAmount: function(data) {
        dispatch(setAmount(data));
      }
    };
  })(AmountButtons);
