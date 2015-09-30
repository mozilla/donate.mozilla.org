import React from 'react';
import IntlMixin from 'react-intl';

import AmountButtons from '../components/amount-buttons.jsx';
import Frequency from '../components/donation-frequency.jsx';
import SubmitButton from '../components/submit-button.jsx';
import DonateButton from '../components/donate-button.jsx';
import {paypalLocales} from '../intl-config.json';
import amountModifier from '../scripts/amount-modifier.js';

var simplePaypal = React.createClass({
  mixins: [IntlMixin, require('../mixins/form.jsx')],
  simplePaypal: function(validate, props) {
    var valid = this.validateProps(validate);
    var submitProps = {};
    if (valid) {
      this.setState({
        submitting: true
      });
      submitProps = this.buildProps(props);
      if (submitProps.recurring === "1") {
        this.refs.paypalRecurring.getDOMNode().submit();
      } else {
        this.refs.paypalOneTime.getDOMNode().submit();
      }
    }
  },
  render: function() {
    var currencyCode = this.state.currency.code;
    var amount = this.state.props.amount.values.amount;
    return (
      <div className="simple-paypal">
        <div id="header-copy">
          <h1>
            {this.getIntlMessage("donate_now")}
          </h1>
        </div>
        <div id="form-wrapper" className="container">
          <div className="wrap">
            <div className="row">
              <img src="/images/paypal_logo@2x.png" alt="PayPal Logo" width="140" height="58"/>

              <p id="secure-label">
                <i className="fa fa-lock"></i>
                {this.getIntlMessage("secure")}
              </p>
            </div>
            <div className="row">
              <div className="full">
                <h4>
                  {this.getIntlMessage("select_donation")}
                </h4>
              </div>
            </div>
            <div className="row">
              <div className="full">
                <AmountButtons name="amount"
                  currency={this.state.currency}
                  onChange={this.updateFormField}
                  presets={this.state.presets}
                  amount={amount}
                />
                <Frequency onChange={this.onFrequencyChange} name="frequency"
                  value={this.state.props.frequency.values.frequency}
                />
                <SubmitButton
                  submitting={this.state.submitting}
                  validate={["amount"]}
                  onSubmit={this.simplePaypal}
                  submit={["amount", "frequency"]}
                  error={this.state.errors.other}
                >
                  <DonateButton
                    amount={amount} currency={currencyCode}
                  />
                </SubmitButton>

              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <p className="donation-notice">
            <small>
              {this.getIntlMessage("donation_notice")}
            </small>
          </p>
        </div>

        <form action={process.env.PAYPAL_ENDPOINT + "/cgi-bin/webscr"} method="post" target="_top" ref="paypalOneTime">
          <input type="hidden" name="cmd" value="_donations"/>
          <input type="hidden" name="business" value={process.env.PAYPAL_EMAIL}/>
          <input type="hidden" name="lc" value={paypalLocales[this.props.locales[0]]}/>
          <input type="hidden" name="item_name" value={this.getIntlMessage("mozilla_donation")}/>
          <input type="hidden" name="no_note" value="1"/>
          <input type="hidden" name="no_shipping" value="1"/>
          <input type="hidden" name="rm" value="1"/>
          {/* Donation Amount */}
          <input type="hidden" name="amount" value={amountModifier.paypal(amount, currencyCode)}/>
          <input type="hidden" name="return" value={process.env.APPLICATION_URI + "/" + this.props.locales[0] + "/thank-you/"}/>
          <input type="hidden" name="currency_code" value={currencyCode.toUpperCase()}/>
        </form>

        <form action={process.env.PAYPAL_ENDPOINT + "/cgi-bin/webscr"} method="post" ref="paypalRecurring">
          <input type="hidden" name="cmd" value="_xclick-subscriptions"/>
          <input type="hidden" name="business" value={process.env.PAYPAL_EMAIL}/>
          <input type="hidden" name="lc" value={paypalLocales[this.props.locales[0]]}/>
          <input type="hidden" name="item_name" value={this.getIntlMessage("mozilla_monthly_donation")}/>
          <input type="hidden" name="no_note" value="1"/>
          <input type="hidden" name="no_shipping" value="2"/>
          <input type="hidden" name="return" value={process.env.APPLICATION_URI + "/" + this.props.locales[0] + "/thank-you/"}/>
          <input type="hidden" name="src" value="1"/>
          <input type="hidden" name="p3" value="1"/>
          <input type="hidden" name="currency_code" value={currencyCode.toUpperCase()}/>
          <input type="hidden" name="t3" value="M"/>
          <input name="srt" type="hidden" value="0"/>
          <input type="hidden" name="a3" value={amountModifier.paypal(amount, currencyCode)}/>

        </form>
      </div>
    );
  }
});

module.exports = simplePaypal;
