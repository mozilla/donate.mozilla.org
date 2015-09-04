import React from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import SmallPrint from '../components/small-print.jsx';
import SectionHeading from '../components/section-heading.jsx';
import CurrencyDrop from '../components/currency-dropdown.jsx';

import AmountButtons from '../components/amount-buttons.jsx';
import Frequency from '../components/donation-frequency.jsx';
import PayPalButton from '../components/paypal-button.jsx';
import StripeButton from '../components/stripe-button.jsx';
import FormContainer from '../components/form-container.jsx';

var SingleForm = React.createClass({
  mixins: [require('react-intl').IntlMixin, require('../mixins/form.jsx')],
  render: function() {
    return (
      <div className="mozilla-eoy-donation">
        <Header/>
        <div className="container">
          <SectionHeading>
            <h2>
              {this.getIntlMessage("donate_now")}
              <span className="currency-dropdown-container">
                <CurrencyDrop
                  currencies={this.props.currencies}
                  currency={this.props.currency.code}
                  onChange={this.onCurrencyChanged}
                />
              </span>
            </h2>
          </SectionHeading>
          <AmountButtons name="amount"
            currency={this.props.currency.code}
            currencySymbol={this.props.currency.symbol}
            onChange={this.onAmountChange}
            amount={this.state.values.amount}
            presets={this.props.presets}
          />
          <Frequency onChange={this.onChange} name="frequency"/>
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
