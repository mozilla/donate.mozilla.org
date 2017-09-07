import React from 'react';
import MozillaFooter from '../components/mozilla/footer.js';
import Header from '../components/header.js';
import AmountButtons from '../components/amount-buttons.js';
import Frequency from '../components/donation-frequency.js';
import SubmitButton from '../components/submit-button.js';
import DonateButton from '../components/donate-button.js';
import { paypalLocales } from '../../intl-config.js';
import amountModifier from '../lib/amount-modifier.js';
import { connect } from 'react-redux';
import { setAmountError } from '../actions';

var PaypalForm = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  submit: function() {
    if (this.props.frequency === "monthly") {
      this.refs.paypalRecurring.submit();
    } else {
      this.refs.paypalOneTime.submit();
    }
  },
  render: function() {
    var amount = this.props.amount;
    var currencyCode = this.props.currency.code || "";
    var locale = this.context.intl.locale;
    return (
      <span>
        <form action={process.env.PAYPAL_ENDPOINT + "/cgi-bin/webscr"} method="post" target="_top" ref="paypalOneTime">
          <input type="hidden" name="cmd" value="_donations"/>
          <input type="hidden" name="business" value={process.env.PAYPAL_EMAIL}/>
          <input type="hidden" name="lc" value={paypalLocales[locale]}/>
          <input type="hidden" name="item_name" value={this.context.intl.formatMessage({id: "mozilla_donation"})}/>
          <input type="hidden" name="no_note" value="1"/>
          <input type="hidden" name="no_shipping" value="1"/>
          <input type="hidden" name="rm" value="1"/>
          {/* Donation Amount */}
          <input type="hidden" name="amount" value={amountModifier.paypal(amount, currencyCode)}/>
          <input type="hidden" name="return" value={process.env.APPLICATION_URI + "/" + locale + "/thank-you/"}/>
          <input type="hidden" name="currency_code" value={currencyCode.toUpperCase()}/>
        </form>
        <form action={process.env.PAYPAL_ENDPOINT + "/cgi-bin/webscr"} method="post" ref="paypalRecurring">
          <input type="hidden" name="cmd" value="_xclick-subscriptions"/>
          <input type="hidden" name="business" value={process.env.PAYPAL_EMAIL}/>
          <input type="hidden" name="lc" value={paypalLocales[locale]}/>
          <input type="hidden" name="item_name" value={this.context.intl.formatMessage({id: "mozilla_monthly_donation"})}/>
          <input type="hidden" name="no_note" value="1"/>
          <input type="hidden" name="no_shipping" value="2"/>
          <input type="hidden" name="return" value={process.env.APPLICATION_URI + "/" + locale + "/thank-you/"}/>
          <input type="hidden" name="src" value="1"/>
          <input type="hidden" name="p3" value="1"/>
          <input type="hidden" name="currency_code" value={currencyCode.toUpperCase()}/>
          <input type="hidden" name="t3" value="M"/>
          <input name="srt" type="hidden" value="0"/>
          <input type="hidden" name="a3" value={amountModifier.paypal(amount, currencyCode)}/>
        </form>
      </span>
    );
  }
});

var NOT_SUBMITTING = 0;
var PAYPAL_SUBMITTING = 3;
var simplePaypal = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      submitting: NOT_SUBMITTING
    };
  },
  validatePaypal: function() {
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
      return;
    }
    this.refs.paypalForm.submit();
  },
  render: function() {
    var className = "row";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div className={className}>
        <Header>
          <h3>
            {this.context.intl.formatMessage({id: "donate_now"})}
          </h3>
        </Header>
        <div className="simple-paypal">
          <div className="container">
            <div className="wrap">
              <div className="row">
                <img src="/assets/images/paypal_logo@2x.603485f928e450e7098eb55bc982e19a.png" alt="PayPal Logo" width="140" height="58"/>

                <p id="secure-label">
                  <i className="fa fa-lock"></i>
                  {this.context.intl.formatMessage({id: "secure"})}
                </p>
              </div>
              <div className="row">
                <div className="full">
                  <h4>{this.context.intl.formatMessage({id: "select_donation"})}</h4>
                </div>
              </div>
              <div className="row">
                <div className="full">
                  <AmountButtons/>
                  <Frequency/>
                  <div className="row submit-button">
                    <div className="full submit-button-container">
                      <SubmitButton
                        submitting={this.state.submitting === PAYPAL_SUBMITTING}
                        onSubmit={this.validatePaypal}
                      >
                        <DonateButton/>
                      </SubmitButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <p className="donation-notice">
              {this.context.intl.formatMessage({id: "donation_notice"})}
            </p>
          </div>
          <PaypalForm ref="paypalForm"
            currency={this.props.currency}
            amount={this.props.amount}
            frequency={this.props.frequency}
          />
        </div>
        <MozillaFooter/>
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
})(simplePaypal);
