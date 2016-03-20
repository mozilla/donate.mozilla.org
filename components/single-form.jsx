import React from 'react';
import SectionHeading from '../components/section-heading.jsx';
import CurrencyDropdown from '../components/currency-dropdown.jsx';
import {ErrorListener} from '../components/error.jsx';

import AmountButtons from '../components/amount-buttons.jsx';
import Frequency from '../components/donation-frequency.jsx';
import {PayPalButton, StripeButton} from '../components/payment-options.jsx';
import SubmitButton from '../components/submit-button.jsx';
import DonateButton from '../components/donate-button.jsx';
import form from '../scripts/form.js';
import {FormattedMessage, FormattedHTMLMessage, FormattedNumber} from 'react-intl';

var SingleForm = React.createClass({
  mixins: [require('../mixins/form.jsx')],
  propTypes: {
    monthlyPopup: React.PropTypes.bool,
    billingAddress: React.PropTypes.bool,
    appName: React.PropTypes.string
  },
  contextTypes: {
    intl: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      displayPopup: false,
      submit: '',
      validate: '',
      payment: ''
    };
  },
  displayMonthlyPopup: function(options) {
    this.setState({
      displayPopup: true,
      submit: options.submit,
      payment: options.payment,
      validate: options.validate
    });
  },
  closeMonthlyPopup: function() {
    this.setState({
      displayPopup: false
    });
  },
  onPopupYes: function() {
    if (this.state.payment === 'stripe') {
      this.closeMonthlyPopup();
      form.updateField("frequency", 'monthly');
      form.updateField("amount", 5);
      this.stripeCheckout(this.state.validate, this.state.submit, this.props.billingAddress, this.props.appName);
    }
    if (this.state.payment === 'paypal') {
      this.closeMonthlyPopup();
      form.updateField("frequency", 'monthly');
      form.updateField("amount", 5);
      this.paypal(this.state.validate, this.state.submit, this.props.appName);
    }
  },
  onPopupNo: function() {
    if (this.state.payment === 'stripe') {
      this.closeMonthlyPopup();
      this.stripeCheckout(this.state.validate, this.state.submit, this.props.billingAddress, this.props.appName);
    }
    if (this.state.payment === 'paypal') {
      this.closeMonthlyPopup();
      this.paypal(this.state.validate, this.state.submit, this.props.appName);
    }
  },
  renderPopup: function() {
    var amount = this.state.amount;
    var newAmount = 5;
    if (this.state.displayPopup) {
      return (
        <div className="overlay">
          <div className="popup">
            <h3>
              <FormattedMessage
                id='h1_popup_further_monlth'
                amount={<span>
                  { this.state.currency.code ?
                  <FormattedNumber
                    maximumFractionDigits={2}
                    value={newAmount}
                    style="currency"
                    currency={this.state.currency.code}
                  /> : "" }
                </span>}
              />
            </h3>
            <button className="close fa fa-close" onClick={this.closeMonthlyPopup}></button>
            <div className="popup-btn yes" onClick={this.onPopupYes}>
              <FormattedHTMLMessage
                id='popup_answer_yes'
                newAmount={<span>
                  { this.state.currency.code ?
                  <FormattedNumber
                    maximumFractionDigits={2}
                    value={newAmount}
                    style="currency"
                    currency={this.state.currency.code}
                  /> : "" }
                </span>}
              />
            </div>
            <div className="popup-btn no" onClick={this.onPopupNo}>
              <FormattedHTMLMessage
                id='popup_answer_no'
                amount={<span>
                  { this.state.currency.code ?
                  <FormattedNumber
                    maximumFractionDigits={2}
                    value={amount}
                    style="currency"
                    currency={this.state.currency.code}
                  /> : "" }
                </span>}
              />
            </div>
          </div>
        </div>
      );
    }
    return (
      <span></span>
    );
  },
  checkMonthlyStripePopup: function(validate, submit) {
    var amount = parseInt(this.state.amount, 10);
    if (this.props.monthlyPopup && this.state.currency.code === "usd" &&
        this.state.frequency === "single" && amount >= 5 && amount <= 50) {
      if (form.validate(validate)) {
        this.displayMonthlyPopup({payment: 'stripe', validate: validate, submit: submit});
      }
      return;
    }
    this.stripeCheckout(validate, submit, this.props.billingAddress, this.props.appName);
  },
  renderPrivacyPolicy: function() {
    return (
      <p className="full"><FormattedHTMLMessage id='privacy_policy_var_b'/></p>
    );
  },
  checkMonthlyPaypalPopup: function(validate, submit) {
    var amount = parseInt(this.state.amount, 10);
    if (this.props.monthlyPopup && this.state.currency.code === "usd" &&
        this.state.frequency === "single" && amount >= 5 && amount <= 50) {
      if (form.validate(validate)) {
        this.displayMonthlyPopup({payment: 'paypal', validate: validate, submit: submit});
      }
      return;
    }
    this.paypal(validate, submit, this.props.appName);
  },
  renderPaymentOptions: function() {
    if (!this.state.currency.disabled) {
      return (
        <span>
          <SectionHeading>
            <h4>{this.context.intl.formatMessage({id: 'choose_payment'})}</h4>
            <p id="secure-label"><i className="fa fa-lock"></i>{this.context.intl.formatMessage({id: 'secure'})}</p>
          </SectionHeading>
          <div className="row">
            {this.renderPrivacyPolicy()}
          </div>
          <ErrorListener errors={["cardNumber", "cvc", "expMonth", "expYear"]}/>
          <div className="frequency-move">
            <StripeButton
              name="payment-type-test"
              submit={["frequency-test", "amount"]}
              validate={["amount"]}
              onSubmit={this.checkMonthlyStripePopup}
            />
            <PayPalButton
              name="payment-type-test"
              submitting={this.state.submitting}
              submit={["frequency-test", "amount"]}
              validate={["amount"]}
              onSubmit={this.checkMonthlyPaypalPopup}
            />
          </div>
          <div className="frequency-move-baseline">
            <StripeButton
              name="payment-type"
              submit={["frequency", "amount"]}
              validate={["amount"]}
              onSubmit={this.checkMonthlyStripePopup}
            />
            <PayPalButton
              name="payment-type"
              submitting={this.state.submitting}
              submit={["frequency", "amount"]}
              validate={["amount"]}
              onSubmit={this.checkMonthlyPaypalPopup}
            />
          </div>
        </span>
      );
    } else if (this.state.currency.disabled === "paypal") {
      return (
        <span className="paypal-disabled">
          <SectionHeading>
            <h3>{this.context.intl.formatMessage({id: 'credit_card'})}</h3>
            <p id="secure-label">
              <i className="fa fa-lock"></i>{this.context.intl.formatMessage({id: 'secure'})}
            </p>
            <div className="row payment-logos credit-card-logos">
              <p>&nbsp;</p>
            </div>
          </SectionHeading>
          <div className="row">
            {this.renderPrivacyPolicy()}
          </div>
          <ErrorListener errors={["cardNumber", "cvc", "expMonth", "expYear"]}/>
          <div className="frequency-move">
            <SubmitButton
              submitting={this.state.submitting}
              submit={["amount", "frequency"]}
              validate={["amount"]}
              onSubmit={this.checkMonthlyStripePopup}
            >
              <DonateButton currency={this.state.currency}/>
            </SubmitButton>
          </div>
          <div className="frequency-move-baseline">
            <SubmitButton
              submitting={this.state.submitting}
              submit={["amount", "frequency-test"]}
              validate={["amount"]}
              onSubmit={this.checkMonthlyStripePopup}
            >
              <DonateButton currency={this.state.currency}/>
            </SubmitButton>
          </div>
        </span>
      );
    }
  },
  render: function() {
    return (
      <div className="container">
        <SectionHeading>
          <h3>
            {this.context.intl.formatMessage({id: 'donate_now'})}
            <span className="right">
              <CurrencyDropdown/>
            </span>
          </h3>
        </SectionHeading>
        {this.renderPopup()}
        <div className="frequency-move">
          <Frequency name="frequency-test"/>
        </div>
        <AmountButtons name="amount" />
        <div className="frequency-move-baseline">
          <Frequency name="frequency"/>
        </div>
        <div className="payment-section">
          {this.renderPaymentOptions()}
        </div>
      </div>
    );
  }
});

module.exports = SingleForm;
