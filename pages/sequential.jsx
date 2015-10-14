import React from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import SmallPrint from '../components/small-print.jsx';
import SectionHeading from '../components/section-heading.jsx';
import CurrencyDropdown from '../components/currency-dropdown.jsx';

import NavigationMenu from '../components/navigation-menu.jsx';
import NavigationButton from '../components/navigation-button.jsx';
import NavigationContainer from '../components/navigation-container.jsx';
import NextButton from '../components/next-button.jsx';
import Page from '../components/navigation-page.jsx';
import SubmitButton from '../components/submit-button.jsx';
import DonateButton from '../components/donate-button.jsx';
import PayPalButton from '../components/paypal-button.jsx';
import CreditCardButton from '../components/credit-card-button.jsx';

import AmountButtons from '../components/amount-buttons.jsx';
import Frequency from '../components/donation-frequency.jsx';
import CrediCardInfo from '../components/credit-card-info.jsx';
import Name from '../components/name-input.jsx';
import Address from '../components/address-input.jsx';
import Email from '../components/email-input.jsx';
import PrivacyPolicy from '../components/privacy-policy-input.jsx';

import IntlMixin from 'react-intl';

module.exports = React.createClass({
  mixins: [IntlMixin, require('../mixins/form.jsx')],
  getInitialState() {
    return {
      activePage: 0,
      hideCreditCardDetails: true,
      height: "252px"
    };
  },
  expandCreditCardInfo: function() {
    this.setState({
      hideCreditCardDetails: false
    });
    this.setState({
      paymentType: this.getIntlMessage('credit_card')
    });
    window.setTimeout(this.refs.creditCardInfoField.focus, 500);
    this.updateHeight();
  },
  collapseCreditCardInfo: function() {
    this.setState({
      hideCreditCardDetails: true
    });
    this.setState({
      paymentType: "PayPal"
    });
    this.updateHeight();
  },
  render: function() {
    var creditCardDetailsClassName = "row credit-card-section";
    if (this.state.hideCreditCardDetails) {
      creditCardDetailsClassName += " hidden";
    }
    var amount = this.state.props.amount.values.amount;
    var currency = this.state.currency;
    return (
      <div className="row">
        <Header/>
        <div className="container">

          <NavigationMenu>
            <NavigationButton amount={amount} currency={currency.code} onClick={this.toThisPage} activePage={this.state.activePage} index={0}>
              <div>{this.getIntlMessage("amount")}</div>
            </NavigationButton>
            <NavigationButton display={this.state.paymentType} onClick={this.toThisPage} activePage={this.state.activePage} index={1}>
              <div>{this.getIntlMessage("payment")}</div>
            </NavigationButton>
            <NavigationButton activePage={this.state.activePage} index={2}>
              <div>{this.getIntlMessage("personal")}</div>
            </NavigationButton>
          </NavigationMenu>

          <NavigationContainer height={this.state.height}>
            <Page activePage={this.state.activePage} index={0}>
              <SectionHeading>
                <h2>
                  {this.getIntlMessage("donate_now")}
                  <span className="right">
                    <CurrencyDropdown
                      currencies={this.props.currencies}
                      currency={currency.code}
                      onChange={this.onCurrencyChanged}
                    />
                  </span>
                </h2>
              </SectionHeading>
              <AmountButtons name="amount"
                currency={currency}
                onChange={this.updateFormField}
                amount={amount} presets={this.state.presets}
              />
              <Frequency onChange={this.onFrequencyChange} name="frequency" value={this.state.props.frequency.values.frequency}/>
              <NextButton onClick={this.nextPage} validate={["amount"]}/>
            </Page>

            <Page activePage={this.state.activePage} index={1} onError={this.onPageError} errors={[this.state.errors.creditCardInfo]}>
              <SectionHeading>
                <h2>{this.getIntlMessage("choose_payment")}</h2>
                <p id="secure-label">
                  <i className="fa fa-lock"></i>{this.getIntlMessage('secure')}
                </p>
              </SectionHeading>
              <div className="row">
                <CreditCardButton onClick={this.expandCreditCardInfo}/>
                <PayPalButton
                  submit={["frequency", "amount"]}
                  onSubmit={this.paypal}
                  onClick={this.collapseCreditCardInfo}
                />
              </div>
              <div className={creditCardDetailsClassName}>
                <CrediCardInfo error={this.state.errors.creditCardInfo}
                  onChange={this.onChange} name="creditCardInfo" ref="creditCardInfoField"
                />
                <NextButton onClick={this.nextPage} validate={["creditCardInfo"]}/>
              </div>
            </Page>

            <Page activePage={this.state.activePage} index={2} onError={this.onPageError} errors={[this.state.errors.address, this.state.errors.other]}>
              <SectionHeading>
                <h2>{this.getIntlMessage("personal")}</h2>
              </SectionHeading>
              <div className="full billing-info">
                <Name onChange={this.onChange} name="name"/>
                <Address
                  onChange={this.onChange}
                  name="address"
                  error={this.state.errors.address}
                />
                <Email onChange={this.onChange} name="email" info={this.getIntlMessage("email_info")}/>
              </div>
              <PrivacyPolicy onChange={this.onChange} name="privacyPolicy"/>
              <SubmitButton
                submitting={this.state.submitting}
                validate={["name", "address", "email", "privacyPolicy"]}
                onSubmit={this.stripe}
                submit={["amount", "frequency", "creditCardInfo", "name", "address", "email"]}
                error={this.state.errors.other}
              >
                <DonateButton
                  amount={amount} currency={currency.code}
                />
              </SubmitButton>
            </Page>
          </NavigationContainer>

        </div>
        <SmallPrint stripeNotice={!this.state.hideCreditCardDetails}/>
        <Footer/>
      </div>
    );
  }
});
