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
  stripeCheckoutTest: function(validate, submit) {
    this.stripeCheckout(validate, submit, this.props.billingAddress);
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
          <StripeButton
            name="payment-type"
            submit={["frequency", "amount"]}
            validate={["amount", "privacyPolicy"]}
            onSubmit={this.stripeCheckoutTest}
          />
          <PayPalButton
            name="payment-type"
            submitting={this.state.submitting}
            submit={["frequency", "amount"]}
            validate={["amount", "privacyPolicy"]}
            onSubmit={this.paypal}
          />
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
          <SubmitButton
            submitting={this.state.submitting}
            submit={["amount", "frequency"]}
            validate={["amount", "privacyPolicy"]}
            onSubmit={this.stripeCheckoutTest}
          >
            <DonateButton currency={this.state.currency}/>
          </SubmitButton>
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
        <AmountButtons name="amount" locale={this.props.locales[0]}/>
        <Frequency name="frequency"/>
        <div className="payment-section">
          {this.renderPaymentOptions()}
        </div>
      </div>
    );
  }
});

