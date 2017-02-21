import React from 'react';
import SectionHeading from './section-heading.js';
import CurrencyDropdown from './currency-dropdown.js';
import ErrorMessage from './error.js';

import AmountButtons from './amount-buttons.js';
import Frequency from './donation-frequency.js';
import { PayPalButton, StripeButton } from './payment-options.js';
import SubmitButton from './submit-button.js';
import DonateButton from './donate-button.js';
import { FormattedHTMLMessage } from 'react-intl';
import currencies from '../data/currencies.js';

import { connect } from 'react-redux';
import { setAmountError } from '../actions'; 
import PaypalMixin from '../mixins/paypal.js';
import StripeMixin from '../mixins/stripe.js';

var NOT_SUBMITTING = 0;
var STRIPE_SUBMITTING = 2;
var PAYPAL_SUBMITTING = 3;

var singleForm = React.createClass({
  mixins: [PaypalMixin, StripeMixin],
  contextTypes: {
    intl: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      submitting: NOT_SUBMITTING,
      stripeError: ""
    };
  },
  renderPrivacyPolicy: function() {
    return (
      <p className="full"><FormattedHTMLMessage id="privacy_policy_var_b"/></p>
    );
  },
  validateStripe: function() {
    if (this.validateAmount()) {
      this.stripeCheckout({
        frequency: this.props.frequency,
        amount: this.props.amount,
        appName: this.props.appName,
        currency: this.props.currency.code
      });
    }
  },
  validatePaypal: function() {
    if (this.validateAmount()) {
      this.paypal({
        frequency: this.props.frequency,
        amount: this.props.amount,
        appName: this.props.appName,
        currency: this.props.currency.code
      });
    }
  },
  validateAmount: function() {
    var errorMessage = "";
    var amount = parseInt(this.props.amount, 10);
    var minAmount = parseInt(this.props.currency.minAmount, 10);
    if (!amount) {
      errorMessage = 'please_select_an_amount';
    } else if (amount < minAmount) {
      errorMessage = 'donation_min_error';
    }
    if (errorMessage) {
      this.props.setAmountError(errorMessage);
      return false;
    }
    return true;
  },
  renderPaymentOptions: function() {
    var className = "";

    if (!this.props.currency.disabled) {
      return (
        <div>
          <SectionHeading>
            <h4 className="left choose-payment">{this.context.intl.formatMessage({id: "choose_payment"})}</h4>
            <p id="secure-label" className="right"><i className="fa fa-lock"></i>{this.context.intl.formatMessage({id: 'secure'})}</p>
          </SectionHeading>
          <StripeButton
            currency={this.props.currency}
            name="payment-type"
            onSubmit={this.validateStripe}
            submitting={this.state.submitting === STRIPE_SUBMITTING}
          />
          <PayPalButton
            name="payment-type"
            submitting={this.state.submitting === PAYPAL_SUBMITTING}
            onSubmit={this.validatePaypal}
          />
          <div className="row">
            {this.renderPrivacyPolicy()}
          </div>
        </div>
      );
    } else if (this.props.currency.disabled === "paypal") {
      className = "row payment-logos credit-card-logos";
      if (currencies[this.props.currency.code].amexDisabled) {
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
          <div className="row submit-button">
            <div className="full submit-button-container">
              <SubmitButton
                submitting={this.state.submitting === STRIPE_SUBMITTING}
                onSubmit={this.validateStripe}
              >
                <DonateButton currency={this.props.currency}/>
              </SubmitButton>
            </div>
          </div>
        </div>
      );
    }
  },
  render: function() {
    return (
      <div className="container">
        <SectionHeading>
          <h3 className="donate-now-header">
            {this.context.intl.formatMessage({id: "donate_now"})}
          </h3>
          <CurrencyDropdown/>
        </SectionHeading>
        <Frequency/>
        <AmountButtons/>
        <div className="payment-section">
          {this.renderPaymentOptions()}
          <ErrorMessage message={this.state.stripeError}/>
        </div>
      </div>
    );
  }
});

module.exports = connect(
function(state) {
  return {
    currency: state.donateForm.currency,
    amount: state.donateForm.amount,
    frequency: state.donateForm.frequency
  };
},
function(dispatch) {
  return {
    setAmountError: function(data) {
      dispatch(setAmountError(data));
    }
  };
})(singleForm);
