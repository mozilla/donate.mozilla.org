import React from 'react';
import MozillaFooter from '../components/mozilla/footer.jsx';
import Header from '../components/header.jsx';
import AmountButtons from '../components/amount-buttons.jsx';
import Frequency from '../components/donation-frequency.jsx';
import SubmitButton from '../components/submit-button.jsx';
import DonateButton from '../components/donate-button.jsx';
import {paypalLocales} from '../intl-config.js';
import amountModifier from '../scripts/amount-modifier.js';

import listener from '../scripts/listener.js';
import form from '../scripts/form.js';

var PaypalForm = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      amount: "",
      currency: {}
    };
  },
  componentDidMount: function() {
    listener.on("fieldUpdated", this.onFieldUpdated);
    listener.on("stateUpdated", this.onStateUpdated);
  },
  componentWillUnmount: function() {
    listener.off("fieldUpdated", this.onFieldUpdated);
    listener.off("stateUpdated", this.onStateUpdated);
  },
  onFieldUpdated: function(e) {
    var detail = e.detail;
    if (detail.field === "amount") {
      this.setState({
        amount: detail.value
      });
    }
  },
  onStateUpdated: function(e) {
    var detail = e.detail;
    if (detail.state === "currency") {
      this.setState({
        currency: detail.value
      });
    }
  },
  submit: function(frequency) {
    if (frequency === "monthly") {
      this.refs.paypalRecurring.submit();
    } else {
      this.refs.paypalOneTime.submit();
    }
  },
  render: function() {
    var amount = this.state.amount;
    var currencyCode = this.state.currency.code || "";
    return (
      <span>
        <form action={process.env.PAYPAL_ENDPOINT + "/cgi-bin/webscr"} method="post" target="_top" ref="paypalOneTime">
          <input type="hidden" name="cmd" value="_donations"/>
          <input type="hidden" name="business" value={process.env.PAYPAL_EMAIL}/>
          <input type="hidden" name="lc" value={paypalLocales[this.context.intl.locale]}/>
          <input type="hidden" name="item_name" value={this.context.intl.formatMessage({id: "mozilla_donation"})}/>
          <input type="hidden" name="no_note" value="1"/>
          <input type="hidden" name="no_shipping" value="1"/>
          <input type="hidden" name="rm" value="1"/>
          {/* Donation Amount */}
          <input type="hidden" name="amount" value={amountModifier.paypal(amount, currencyCode)}/>
          <input type="hidden" name="return" value={process.env.APPLICATION_URI + "/" + this.context.intl.locale + "/thank-you/"}/>
          <input type="hidden" name="currency_code" value={currencyCode.toUpperCase()}/>
        </form>
        <form action={process.env.PAYPAL_ENDPOINT + "/cgi-bin/webscr"} method="post" ref="paypalRecurring">
          <input type="hidden" name="cmd" value="_xclick-subscriptions"/>
          <input type="hidden" name="business" value={process.env.PAYPAL_EMAIL}/>
          <input type="hidden" name="lc" value={paypalLocales[this.context.intl.locale]}/>
          <input type="hidden" name="item_name" value={this.context.intl.formatMessage({id: "mozilla_monthly_donation"})}/>
          <input type="hidden" name="no_note" value="1"/>
          <input type="hidden" name="no_shipping" value="2"/>
          <input type="hidden" name="return" value={process.env.APPLICATION_URI + "/" + this.context.intl.locale + "/thank-you/"}/>
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

var simplePaypal = React.createClass({
  mixins: [require('../mixins/form.jsx')],
  contextTypes: {
    intl: React.PropTypes.object
  },
  propTypes: {
    test: React.PropTypes.string
  },
  simplePaypal: function(validate, props) {
    var valid = form.validate(validate);
    var submitProps = {};
    if (valid) {
      this.setState({
        submitting: true
      });
      submitProps = form.buildProps(props);
      this.refs.paypalForm.submit(submitProps.frequency);
    }
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
                  <AmountButtons name="amount" />
                  <Frequency name="frequency"/>
                  <SubmitButton
                    submitting={this.state.submitting}
                    validate={["amount"]}
                    onSubmit={this.simplePaypal}
                    submit={["amount", "frequency"]}
                  >
                    <DonateButton/>
                  </SubmitButton>

                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <p className="donation-notice">
              {this.context.intl.formatMessage({id: "donation_notice"})}
            </p>
          </div>
          <PaypalForm ref="paypalForm" />
        </div>
        <MozillaFooter/>
      </div>
    );
  }
});

module.exports = simplePaypal;
