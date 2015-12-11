import React from 'react';
import SectionHeading from '../components/section-heading.jsx';
import CurrencyDropdown from '../components/currency-dropdown.jsx';
import {ErrorListener} from '../components/error.jsx';

import AmountButtons from '../components/amount-buttons.jsx';
import Frequency from '../components/donation-frequency.jsx';
import {PayPalButton, StripeButton} from '../components/payment-options.jsx';

import SubmitButton from '../components/submit-button.jsx';
import DonateButton from '../components/donate-button.jsx';
import {PrivacyPolicyCheckbox} from '../components/checkbox.jsx';

module.exports = React.createClass({
  mixins: [require('react-intl').IntlMixin, require('../mixins/form.jsx')],
  propTypes: {
    currency: React.PropTypes.object.isRequired,
    presets: React.PropTypes.array.isRequired,
    amount: React.PropTypes.string.isRequired,
    frequency: React.PropTypes.string.isRequired
  },
  checkMonthlyStripePopup: function(validate, submit) {
    if (this.props.displayMonthlyPopup) {
      this.props.displayMonthlyPopup(function() {
        this.stripeCheckout(validate, submit, this.props.billingAddress);
      });
      return;
    }
    this.stripeCheckout(validate, submit, this.props.billingAddress);
  },
  checkMonthlyPaypalPopup: function(validate, submit) {
    if (this.props.displayMonthlyPopup) {
      this.props.displayMonthlyPopup(function() {
        this.paypal(validate, submit);
      });
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
            <PrivacyPolicyCheckbox name="privacyPolicy"/>
          </div>
          <ErrorListener errors={["cardNumber", "cvc", "expMonth", "expYear"]}/>
          <div className="frequency-move">
            <StripeButton
              name="payment-type-test"
              submit={["frequency-test", "amount"]}
              validate={["amount", "privacyPolicy"]}
              onSubmit={this.checkMonthlyStripePopup}
            />
            <PayPalButton
              name="payment-type-test"
              submitting={this.state.submitting}
              submit={["frequency-test", "amount"]}
              validate={["amount", "privacyPolicy"]}
              onSubmit={this.checkMonthlyPaypalPopup}
            />
          </div>
          <div className="frequency-move-baseline">
            <StripeButton
              name="payment-type"
              submit={["frequency", "amount"]}
              validate={["amount", "privacyPolicy"]}
              onSubmit={this.checkMonthlyStripePopup}
            />
            <PayPalButton
              name="payment-type"
              submitting={this.state.submitting}
              submit={["frequency", "amount"]}
              validate={["amount", "privacyPolicy"]}
              onSubmit={this.checkMonthlyPaypalPopup}
            />
          </div>
        </span>
      );
    } else if (this.state.currency.disabled === "paypal") {
      return (
        <span className="paypal-disabled">
          <SectionHeading>
            <h2>{this.getIntlMessage("credit_card")}</h2>
            <p id="secure-label">
              <i className="fa fa-lock"></i>{this.getIntlMessage('secure')}
            </p>
            <div className="row payment-logos credit-card-logos">
              <p>&nbsp;</p>
            </div>
          </SectionHeading>
          <div className="row">
            <PrivacyPolicyCheckbox name="privacyPolicy"/>
          </div>
          <ErrorListener errors={["cardNumber", "cvc", "expMonth", "expYear"]}/>
          <div className="frequency-move">
            <SubmitButton
              submitting={this.state.submitting}
              submit={["amount", "frequency"]}
              validate={["amount", "privacyPolicy"]}
              onSubmit={this.checkMonthlyStripePopup}
            >
              <DonateButton currency={this.state.currency}/>
            </SubmitButton>
          </div>
          <div className="frequency-move-baseline">
            <SubmitButton
              submitting={this.state.submitting}
              submit={["amount", "frequency-test"]}
              validate={["amount", "privacyPolicy"]}
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
          <h2>
            {this.getIntlMessage("donate_now")}
            <span className="right">
              <CurrencyDropdown/>
            </span>
          </h2>
        </SectionHeading>
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
