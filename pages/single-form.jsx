import React from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import SectionHeading from '../components/section-heading.jsx';
import AmountButtons from '../components/amount-buttons.jsx';
import Frequency from '../components/donation-frequency.jsx';
import PayPalButton from '../components/paypal-button.jsx';
import CreditCardButton from '../components/credit-card-button.jsx';

var SingleForm = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  render: function() {
    return (
      <div className="mozilla-eoy-donation">
        <Header/>
          <div className="container">
            <SectionHeading>
              <h2>{this.getIntlMessage("donate_now")}</h2>
            </SectionHeading>
            <AmountButtons />
            <Frequency/>
            <div className="payment-section">
              <SectionHeading>
                <h2>{this.getIntlMessage("payment")}</h2>
                <p id="secure-label"><i className="fa fa-lock"></i>{this.getIntlMessage('secure')}</p>
              </SectionHeading>
              <PayPalButton/>
              <CreditCardButton/>
            </div>
          </div>
        <Footer/>
      </div>
    );
  }
});

module.exports = SingleForm;
