import React from 'react';
import SectionHeading from './section-heading.js';
import CurrencyDropdown from './currency-dropdown.js';
import {ErrorListener} from './error.js';

import AmountButtons from './amount-buttons.js';
import Frequency from './donation-frequency.js';
import {PayPalButton, StripeButton} from './payment-options.js';
import SubmitButton from './submit-button.js';
import DonateButton from './donate-button.js';
import {FormattedHTMLMessage} from 'react-intl';

module.exports = React.createClass({
  mixins: [require('../mixins/form.js')],
  contextTypes: {
    intl: React.PropTypes.object
  },
  propTypes: {
    currency: React.PropTypes.object.isRequired,
    presets: React.PropTypes.array.isRequired,
    amount: React.PropTypes.string.isRequired,
    frequency: React.PropTypes.string.isRequired
  },
  getInitialState: function() {
    return {
      submit: '',
      validate: '',
      payment: ''
    };
  },
  renderPrivacyPolicy: function() {
    return (
      <p className="full"><FormattedHTMLMessage id="privacy_policy_var_b"/></p>
    );
  },
  renderPaymentOptions: function() {
    if (!this.state.currency.disabled) {
      return (
        <span>
          <SectionHeading>
            <h4 className="left choose-payment">{this.context.intl.formatMessage({id: "choose_payment"})}</h4>
            <p id="secure-label" className="right"><i className="fa fa-lock"></i>{this.context.intl.formatMessage({id: 'secure'})}</p>
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
              onSubmit={this.stripeCheckout}
            />
            <PayPalButton
              name="payment-type-test"
              submitting={this.state.submitting}
              submit={["frequency-test", "amount"]}
              validate={["amount"]}
              onSubmit={this.paypal}
            />
          </div>
          <div className="frequency-move-baseline">
            <StripeButton
              name="payment-type"
              submit={["frequency", "amount"]}
              validate={["amount"]}
              onSubmit={this.stripeCheckout}
            />
            <PayPalButton
              name="payment-type"
              submitting={this.state.submitting}
              submit={["frequency", "amount"]}
              validate={["amount"]}
              onSubmit={this.paypal}
            />
          </div>
        </span>
      );
    } else if (this.state.currency.disabled === "paypal") {
      return (
        <span className="paypal-disabled">
          <SectionHeading>
            <h3>{this.context.intl.formatMessage({id: "credit_card"})}</h3>
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
              onSubmit={this.stripeCheckout}
            >
              <DonateButton currency={this.state.currency}/>
            </SubmitButton>
          </div>
          <div className="frequency-move-baseline">
            <SubmitButton
              submitting={this.state.submitting}
              submit={["amount", "frequency-test"]}
              validate={["amount"]}
              onSubmit={this.stripeCheckout}
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
            {this.context.intl.formatMessage({id: "donate_now"})}
            <span className="right">
              <CurrencyDropdown/>
            </span>
          </h3>
        </SectionHeading>
        <div className="frequency-move">
          <Frequency name="frequency-test"/>
        </div>
        <AmountButtons name="amount"/>
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
