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

module.exports = React.createClass({
  mixins: [require('react-intl').IntlMixin, require('../mixins/form.jsx')],
  propTypes: {
    currency: React.PropTypes.object.isRequired,
    presets: React.PropTypes.array.isRequired,
    amount: React.PropTypes.string.isRequired,
    frequency: React.PropTypes.string.isRequired
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
      this.stripeCheckout(this.state.validate, this.state.submit);
    }
    if (this.state.payment === 'paypal') {
      this.closeMonthlyPopup();
      form.updateField("frequency", 'monthly');
      form.updateField("amount", 5);
      this.paypal(this.state.validate, this.state.submit);
    }
  },
  onPopupNo: function() {
    if (this.state.payment === 'stripe') {
      this.closeMonthlyPopup();
      this.stripeCheckout(this.state.validate, this.state.submit);
    }
    if (this.state.payment === 'paypal') {
      this.closeMonthlyPopup();
      this.paypal(this.state.validate, this.state.submit);
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
                message={this.getIntlMessage('h1_popup_further_monlth')}
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
                message={this.getIntlMessage('popup_answer_yes')}
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
                message={this.getIntlMessage('popup_answer_no')}
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
    this.stripeCheckout(validate, submit);
  },
  renderPrivacyPolicy: function() {
    return (
      <p className="full"><FormattedHTMLMessage message={this.getIntlMessage("privacy_policy_var_b")}/></p>
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
    this.paypal(validate, submit);
  },
  renderPaymentOptions: function() {
    if (!this.state.currency.disabled) {
      return (
        <span>
          <SectionHeading>
            <h4>{this.getIntlMessage("choose_payment")}</h4>
            <p id="secure-label"><i className="fa fa-lock"></i>{this.getIntlMessage('secure')}</p>
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
            <h3>{this.getIntlMessage("credit_card")}</h3>
            <p id="secure-label">
              <i className="fa fa-lock"></i>{this.getIntlMessage('secure')}
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
            {this.getIntlMessage("donate_now")}
            <span className="right">
              <CurrencyDropdown/>
            </span>
          </h3>
        </SectionHeading>
        {this.renderPopup()}
        <div className="frequency-move">
          <Frequency name="frequency-test"/>
        </div>
        <AmountButtons name="amount" locale={this.props.locales[0]}/>
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
