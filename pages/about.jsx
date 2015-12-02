import React from 'react';
import Footer from '../components/footer.jsx';
import SmallPrint from '../components/small-print.jsx';
import SectionHeading from '../components/section-heading.jsx';
import CurrencyDropdown from '../components/currency-dropdown.jsx';

import AmountButtons from '../components/amount-buttons.jsx';
import Frequency from '../components/donation-frequency.jsx';
import {PayPalButton, StripeButton} from '../components/payment-options.jsx';

import SubmitButton from '../components/submit-button.jsx';
import DonateButton from '../components/donate-button.jsx';
import {PrivacyPolicyCheckbox} from '../components/checkbox.jsx';

var SingleForm = React.createClass({
  mixins: [require('react-intl').IntlMixin, require('../mixins/form.jsx')],
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
          <StripeButton
            submit={["frequency", "amount"]}
            validate={["amount", "privacyPolicy"]}
            onSubmit={this.stripeCheckout}
          />
          <PayPalButton
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
          <SubmitButton
            submitting={this.state.submitting}
            submit={["amount", "frequency"]}
            validate={["amount", "privacyPolicy"]}
            onSubmit={this.stripeCheckout}
          >
            <DonateButton currency={this.state.currency}/>
          </SubmitButton>
        </span>
      );
    }
  },
  render: function() {
    var className = "row additional-info-container";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div className={className}>
        <div className="additional-info-page">
          <div className="container additional-page">
            <img className="heart-image" height="100" width="107" src="/assets/images/heart.ce7d2d59c757e1598e244e546426577c.svg"/>
            <div>
              <img className="mozilla-watermark" src="/assets/images/mozilla.5e83dba715a0469b92071758876f0373.svg"/>
              <span>{this.getIntlMessage('additional_info')}</span>
            </div>
          </div>
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
        </div>
        <SmallPrint stripeNotice={true} />
        <Footer/>
      </div>
    );
  }
});

module.exports = SingleForm;
