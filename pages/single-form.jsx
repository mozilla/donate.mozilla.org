import React from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import SectionHeading from '../components/section-heading.jsx';
import AmountButtons from '../components/amount-buttons.jsx';
import Frequency from '../components/donation-frequency.jsx';
import PayPalButton from '../components/paypal-button.jsx';
import CreditCardButton from '../components/credit-card-button.jsx';
import FormContainer from '../components/form-container.jsx';

var SingleForm = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  render: function() {
    return (
      <div className="single-form mozilla-eoy-donation">
        <Header/>
        <FormContainer>
          <SectionHeading>
            <h2>{this.getIntlMessage("donate_now")}</h2>
          </SectionHeading>
          <AmountButtons />
          <Frequency/>
          <div className="payment-section">
            <SectionHeading>
              <h4>{this.getIntlMessage("choose_payment")}</h4>
              <p id="secure-label"><i className="fa fa-lock"></i>{this.getIntlMessage('secure')}</p>
            </SectionHeading>
            <CreditCardButton/>
            <PayPalButton/>
          </div>
        </FormContainer>
        <Footer/>
      </div>
    );
  }
});

module.exports = SingleForm;
