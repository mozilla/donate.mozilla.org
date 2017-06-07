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
import currencies from '../data/currencies.js';

var STRIPE_SUBMITTING = 2;
var PAYPAL_SUBMITTING = 3;

var singleForm = React.createClass({
  mixins: [require('../mixins/form.js')],
  contextTypes: {
    intl: React.PropTypes.object
  },
  propTypes: {
    currency: React.PropTypes.object.isRequired,
    presets: React.PropTypes.array.isRequired,
    amount: React.PropTypes.string.isRequired,
    frequency: React.PropTypes.string.isRequired,
    header: React.PropTypes.string
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
    var className = "";

    if (!this.state.currency.disabled) {
      return (
        <div>
          <SectionHeading>
            <h4 className="left choose-payment">{this.context.intl.formatMessage({id: "choose_payment"})}</h4>
            <p id="secure-label" className="right"><i className="fa fa-lock"></i>{this.context.intl.formatMessage({id: 'secure'})}</p>
          </SectionHeading>
          <ErrorListener errors={["cardNumber", "cvc", "expMonth", "expYear"]}/>
          <StripeButton
            currency={this.state.currency}
            name="payment-type"
            submitting={this.state.submitting === STRIPE_SUBMITTING}
            submit={["frequency", "amount"]}
            validate={["amount"]}
            onSubmit={this.stripeCheckout}
          />
          <PayPalButton
            name="payment-type"
            submitting={this.state.submitting === PAYPAL_SUBMITTING}
            submit={["frequency", "amount"]}
            validate={["amount"]}
            onSubmit={this.paypal}
          />
          <div className="row">
            {this.renderPrivacyPolicy()}
          </div>
        </div>
      );
    } else if (this.state.currency.disabled === "paypal") {
      className = "row payment-logos credit-card-logos";
      if (currencies[this.state.currency.code].amexDisabled) {
        className += " no-amex";
      }
      return (
        <div className="paypal-disabled">
          <SectionHeading>
            <h3>{this.context.intl.formatMessage({id: "credit_card"})}</h3>
            <p id="secure-label">
              <i className="fa fa-lock"></i>{this.context.intl.formatMessage({id: 'secure'})}
            </p>
            <div className={className}>
              <p>&nbsp;</p>
            </div>
          </SectionHeading>
          <div className="row">
            {this.renderPrivacyPolicy()}
          </div>
          <ErrorListener errors={["cardNumber", "cvc", "expMonth", "expYear"]}/>
          <SubmitButton
            submitting={this.state.submitting === STRIPE_SUBMITTING}
            submit={["amount", "frequency"]}
            validate={["amount"]}
            onSubmit={this.stripeCheckout}
          >
            <DonateButton currency={this.state.currency}/>
          </SubmitButton>
        </div>
      );
    }
  },
  render: function() {
    var header = this.props.header || this.context.intl.formatMessage({id: "donate_now"});
    return (
      <div className="container">
        <SectionHeading>
          <h3 className="donate-now-header">
            {header}
          </h3>
          <CurrencyDropdown/>
        </SectionHeading>
        <Frequency name="frequency"/>
        <AmountButtons name="amount"/>
        <div className="payment-section">
          {this.renderPaymentOptions()}
          <ErrorListener errors={["other"]}/>
        </div>
      </div>
    );
  }
});

module.exports = singleForm;
