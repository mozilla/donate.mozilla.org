import React from 'react';
import MozillaFooter from '../components/footer-mozilla.jsx';
import Header from '../components/header.jsx';
import SmallPrint from '../components/small-print.jsx';
import SectionHeading from '../components/section-heading.jsx';
import CurrencyDropdown from '../components/currency-dropdown.jsx';
import {ErrorListener} from '../components/error.jsx';

import NavigationMenu from '../components/navigation-menu.jsx';
import {NavigationButton, AmountNavigationButton, DisplayNavigationButton} from '../components/navigation-button.jsx';
import NavigationContainer from '../components/navigation-container.jsx';
import NextButton from '../components/next-button.jsx';
import Page from '../components/navigation-page.jsx';
import SubmitButton from '../components/submit-button.jsx';
import DonateButton from '../components/donate-button.jsx';
import {PayPalButton, CreditCardButton} from '../components/payment-options.jsx';

import AmountButtons from '../components/amount-buttons.jsx';
import Frequency from '../components/donation-frequency.jsx';
import {CardNumber, CardCvc, CardExpMonth, CardExpYear} from '../components/credit-card-info.jsx';
import {FirstName, LastName} from '../components/name-input.jsx';
import {Country, Address, Province, City, Code} from '../components/address-input.jsx';
import Email from '../components/email-input.jsx';
import {PrivacyPolicyCheckbox, SignupCheckbox} from '../components/checkbox.jsx';

import IntlMixin from 'react-intl';

module.exports = React.createClass({
  mixins: [IntlMixin, require('../mixins/form.jsx')],
  getInitialState() {
    return {
      activePage: 0,
      hideCreditCardDetails: true
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
  },
  collapseCreditCardInfo: function() {
    this.setState({
      hideCreditCardDetails: true
    });
    this.setState({
      paymentType: "PayPal"
    });
  },
  renderSubmitButton: function(data) {
    return (
      <SubmitButton
        name={data.name}
        submitting={this.state.submitting}
        validate={data.validate}
        onSubmit={this.stripe}
        submit={data.submit}
        errors={["other", "firstName", "lastName", "address", "country", "province", "city", "email", "code"]}
      >
        <DonateButton/>
      </SubmitButton>
    );
  },
  renderPaymentOptions: function() {
    if (!this.state.currency.disabled) {
      return (
        <span>
          <SectionHeading>
            <h3>{this.getIntlMessage("choose_payment")}</h3>
            <p id="secure-label">
              <i className="fa fa-lock"></i>{this.getIntlMessage('secure')}
            </p>
          </SectionHeading>
          <div className="row">
            <CreditCardButton name="sequential-payment" onClick={this.expandCreditCardInfo}/>
            <PayPalButton
              name="sequential-payment"
              submitting={this.state.submitting}
              submit={["frequency", "amount"]}
              onSubmit={this.paypal}
              onClick={this.collapseCreditCardInfo}
            />
          </div>
        </span>
      );
    } else if (this.state.currency.disabled === "paypal") {
      return (
        <span className="paypal-disabled">
          <SectionHeading>
            <h3>{this.getIntlMessage("credit_card")}</h3>
            <p id="secure-label">
              <i className="fa fa-lock"></i>{this.getIntlMessage('secure')}
            </p>
            <div className="row payment-logos credit-card-logos">
              <p>&nbsp;</p>
            </div>
          </SectionHeading>
        </span>
      );
    }
  },
  render: function() {
    var creditCardDetailsClassName = "row credit-card-section";
    var className = "row";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    if (this.state.hideCreditCardDetails && !this.state.currency.disabled) {
      creditCardDetailsClassName += " hidden";
    }
    var cvcHintClassName = "hint-msg small";
    if (!this.state.showCvcHint) {
      cvcHintClassName += " hidden";
    }
    return (
      <div className={className}>
        <Header locale={this.props.locales[0]} alt={this.getIntlMessage('donate_to_mozilla')}></Header>
        <div className="container">

          <NavigationMenu>
            <AmountNavigationButton activePage={this.state.activePage} index={0}>
              <div>{this.getIntlMessage("amount")}</div>
            </AmountNavigationButton>
            <DisplayNavigationButton display={this.state.paymentType} activePage={this.state.activePage} index={1} validate={["amount"]}>
              <div>{this.getIntlMessage("payment")}</div>
            </DisplayNavigationButton>
            <NavigationButton activePage={this.state.activePage} index={2} validate={["cardNumber", "cvc", "expMonth", "expYear"]}>
              <div>{this.getIntlMessage("personal")}</div>
            </NavigationButton>
          </NavigationMenu>

          <NavigationContainer>
            <Page activePage={this.state.activePage} index={0}>
              <SectionHeading>
                <h3>
                  {this.getIntlMessage("donate_now")}
                  <span className="right">
                    <CurrencyDropdown/>
                  </span>
                </h3>
              </SectionHeading>
              <AmountButtons name="amount" locale={this.props.locales[0]}/>
              <Frequency name="frequency"/>
              <NextButton validate={["amount"]}/>
            </Page>

            <Page activePage={this.state.activePage} index={1} errors={["cardNumber", "cvc", "expMonth", "expYear"]}>

              {this.renderPaymentOptions()}
              <div className={creditCardDetailsClassName}>
                <div className="credit-card-info">
                  <div className="row">
                    <div className="full">
                      <CardNumber
                        name="cardNumber"
                        ref="creditCardInfoField"
                      />
                    </div>
                  </div>
                  <div className="row hint-msg-parent">
                    <div className="half">
                      <div className="exp-container">
                        <CardExpMonth name="expMonth"/>
                        <span className="slash-container">&frasl;</span>
                        <CardExpYear name="expYear"/>
                      </div>
                    </div>
                    <div className="half">
                      <CardCvc
                        name="cvc"
                        showHint={this.state.showCvcHint}
                      />
                    </div>
                    <div className="full">
                      <div className={cvcHintClassName}>
                        <img src="/assets/images/CVC-illustration.70d7262b2227d24a2f440cc0d560b7da.png" className="left"/>
                        <div className="">{this.getIntlMessage('cvc_info')}</div>
                      </div>
                    </div>
                  </div>
                  <ErrorListener errors={["cardNumber", "cvc", "expMonth", "expYear"]}/>
                </div>
                <NextButton validate={["cardNumber", "expMonth", "expYear", "cvc"]}/>
              </div>
            </Page>

            <Page activePage={this.state.activePage} index={2} errors={["other", "firstName", "lastName", "address", "country", "province", "city", "email", "code"]}>
              <SectionHeading>
                <h3>{this.getIntlMessage("personal")}</h3>
              </SectionHeading>
              <div className="row name-input">
                <div className="half">
                  <FirstName name="firstName"/>
                </div>
                <div className="half">
                  <LastName name="lastName"/>
                </div>
              </div>
              <div className="row address-input">
                <div className="base-line-address">
                  <div className="full">
                    <Country name="country"/>
                  </div>
                  <div className="full">
                    <Address name="address"/>
                  </div>
                  <div className="half">
                    <City name="city"/>
                  </div>
                  <div className="half">
                    <Code name="code"/>
                  </div>
                  <div className="full">
                    <Province name="province"/>
                  </div>
                </div>
                <div className="partial-address">
                  <div className="full">
                    <Country name="country-test"/>
                  </div>
                  <div className="full">
                    <Code name="code-test"/>
                  </div>
                </div>
              </div>
              <Email name="email" info={this.getIntlMessage("email_info")}/>
              <PrivacyPolicyCheckbox name="privacyPolicy"/>
              <SignupCheckbox name="signup"/>

              <div className="base-line-address">
                {this.renderSubmitButton({
                  name: "submit-button",
                  validate: ["firstName", "lastName", "country", "address", "city", "code", "province", "email", "privacyPolicy"],
                  submit: ["amount", "frequency", "cardNumber", "expMonth", "expYear", "cvc", "firstName", "lastName", "country", "address", "city", "code", "province", "email", "signup"]
                })}
              </div>
              <div className="partial-address">
                {this.renderSubmitButton({
                  name: "submit-button-test",
                  validate: ["firstName", "lastName", "country-test", "code-test", "email", "privacyPolicy"],
                  submit: ["amount", "frequency", "cardNumber", "expMonth", "expYear", "cvc", "firstName", "lastName", "country-test", "code-test", "email", "signup"]
                })}
              </div>
            </Page>
          </NavigationContainer>

        </div>
        <SmallPrint stripeNotice={!this.state.hideCreditCardDetails}/>
        <MozillaFooter/>
        <script src="https://js.stripe.com/v2/"></script>
      </div>
    );
  }
});
