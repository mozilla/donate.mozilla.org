import React from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import SmallPrint from '../components/small-print.jsx';
import SectionHeading from '../components/section-heading.jsx';
import CurrencyDropdown from '../components/currency-dropdown.jsx';

import AmountButtons from '../components/amount-buttons.jsx';
import Frequency from '../components/donation-frequency.jsx';
import PayPalButton from '../components/paypal-button.jsx';
import StripeButton from '../components/stripe-button.jsx';

var SingleForm = React.createClass({
  mixins: [require('react-intl').IntlMixin, require('../mixins/form.jsx')],
  render: function() {
    return (
      <div className="row">
        <Header/>
        <div className="container">
          <SectionHeading>
            <h2>
              {this.getIntlMessage("donate_now")}
              <span className="right">
                <CurrencyDropdown
                  currencies={this.props.currencies}
                  currency={this.state.currency.code}
                  onChange={this.onCurrencyChanged}
                />
              </span>
            </h2>
          </SectionHeading>
          <AmountButtons name="amount"
            currency={this.state.currency}
            onChange={this.updateFormField}
            amount={this.state.props.amount.values.amount}
            presets={this.state.presets}
          />
          <Frequency onChange={this.onFrequencyChange} name="frequency"
            value={this.state.props.frequency.values.frequency}
          />
          <div className="payment-section">
            <SectionHeading>
              <h4>{this.getIntlMessage("choose_payment")}</h4>
              <p id="secure-label"><i className="fa fa-lock"></i>{this.getIntlMessage('secure')}</p>
            </SectionHeading>
            <StripeButton
              submit={["frequency", "amount"]}
              validate={["amount"]}
              onSubmit={this.stripeCheckout}
            />
            <PayPalButton
              submit={["frequency", "amount"]}
              validate={["amount"]}
              onSubmit={this.paypal}
            />
          </div>
        </div>
        <SmallPrint/>
        <Footer/>
      </div>
    );
  }
});

module.exports = SingleForm;
