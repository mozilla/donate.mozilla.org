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
    var header = (<Header/>);
    var className = "row";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    // FIXME: Right now we only display this header for `en` locales
    // this should be change to display for all once we have other locales translated.
    if (/^(en)(\b|$)/.test(this.props.locales[0])) {
      header = (<Header altWaterMark={this.getIntlMessage('donate_to_mozilla')}></Header>);
    }
    return (
      <div className={className}>
        {header}
        <div className="container">
          <SectionHeading>
            <h2>
              {this.getIntlMessage("donate_now")}
              <span className="right">
                <CurrencyDropdown/>
              </span>
            </h2>
          </SectionHeading>
          <AmountButtons name="amount"/>
          <Frequency name="frequency"/>
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
              submitting={this.state.submitting}
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
