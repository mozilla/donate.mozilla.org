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
import {CardNumber, CardCvc, CardExpMonth, CardExpYear} from '../components/credit-card-info.jsx';
import {FirstName, LastName} from '../components/name-input.jsx';
import {Country, Address, Province, City, Code} from '../components/address-input.jsx';
import Email from '../components/email-input.jsx';
import {PrivacyPolicyCheckbox, SignupCheckbox} from '../components/checkbox.jsx';
import dispatcher from '../scripts/dispatcher.js';

import IntlMixin from 'react-intl';

module.exports = React.createClass({
  mixins: [IntlMixin, require('../mixins/form.jsx')],
  getInitialState() {
    return {
      activePage: 0,
      hideCreditCardDetails: true,
      height: ""
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
    dispatcher.fire("heightChange");
  },
  collapseCreditCardInfo: function() {
    this.setState({
      hideCreditCardDetails: true
    });
    this.setState({
      paymentType: "PayPal"
    });
    dispatcher.fire("heightChange");
  },
  renderSubmitButton: function(data) {
    var amount = this.state.props.amount;
    var currency = this.state.currency;
    return (
      <SubmitButton
        submitting={this.state.submitting}
        validate={data.validate}
        onSubmit={this.stripe}
        submit={data.submit}
        error={this.state.errors.other}
      >
        <DonateButton
          amount={amount} currency={currency.code}
        />
      </SubmitButton>
    );
  },
  render: function() {
    var creditCardDetailsClassName = "row credit-card-section";
    var className = "row";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    if (this.state.hideCreditCardDetails) {
      creditCardDetailsClassName += " hidden";
    }
    
    var props = this.state.props;
    var amount = props.amount;
    var country = props.country;
    var province = props.province;
    var address = props.address;
    var city = props.city;
    var code = props.code;
    var currency = this.state.currency;
    var firstName = props.firstName;
    var lastName = props.lastName;
    var cardNumber = props.cardNumber;
    var cvc = props.cvc;
    var expMonth = props.expMonth;
    var expYear = props.expYear;
    var addressErrorClassName = "row error-msg-row";
    var errors = this.state.errors;
    var codeError = errors.code.message;
    if (codeError === "") {
      addressErrorClassName += " hidden";
    }
    var creditCardErrorClassName = "row error-msg-row";
    var creditCardError = "";
    if (errors.cardNumber.message) {
      creditCardError = errors.cardNumber.message;
    } else if (errors.cvc.message) {
      creditCardError = errors.cvc.message;
    } else if (errors.expMonth.message) {
      creditCardError = errors.expMonth.message;
    } else if (errors.expYear.message) {
      creditCardError = errors.expYear.message;
    }
    if (creditCardError === "") {
      creditCardErrorClassName += " hidden";
    }
    var cvcHintClassName = "hint-msg small";
    if (!this.state.showCvcHint) {
      cvcHintClassName += " hidden";
    }
    return (
      <div className={className}>
        <Header/>
        <div className="container">

          <NavigationMenu>
            <NavigationButton amount={amount} currency={currency.code} activePage={this.state.activePage} index={0}>
              <div>{this.getIntlMessage("amount")}</div>
            </NavigationButton>
            <NavigationButton display={this.state.paymentType} activePage={this.state.activePage} index={1}>
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
                    />
                  </span>
                </h2>
              </SectionHeading>
              <AmountButtons name="amount"
                currency={currency}
                amount={amount} presets={this.state.presets}
              />
              <Frequency name="frequency" value={props.frequency}/>
              <NextButton validate={["amount"]}/>
            </Page>

            <Page activePage={this.state.activePage} index={1} onError={this.onPageError} errors={[errors.cardNumber, errors.cvc, errors.expMonth, errors.expYear]}>
              <SectionHeading>
                <h2>{this.getIntlMessage("choose_payment")}</h2>
                <p id="secure-label">
                  <i className="fa fa-lock"></i>{this.getIntlMessage('secure')}
                </p>
              </SectionHeading>
              <div className="row">
                <CreditCardButton onClick={this.expandCreditCardInfo}/>
                <PayPalButton
                  submitting={this.state.submitting}
                  submit={["frequency", "amount"]}
                  onSubmit={this.paypal}
                  onClick={this.collapseCreditCardInfo}
                />
              </div>
              <div className={creditCardDetailsClassName}>
                <div className="credit-card-info">
                  <div className="row">
                    <div className="full">
                      <CardNumber value={cardNumber}
                        name="cardNumber"
                        ref="creditCardInfoField"
                        error={errors.cardNumber.message}
                      />
                    </div>
                  </div>
                  <div className="row hint-msg-parent">
                    <div className="half">
                      <div className="exp-container">
                        <CardExpMonth value={expMonth}
                          name="expMonth"
                          error={errors.expMonth.message}
                        />
                        <span className="slash-container">&frasl;</span>
                        <CardExpYear value={expYear}
                          name="expYear"
                          error={errors.expYear.message}
                        />
                      </div>
                    </div>
                    <div className="half">
                      <CardCvc
                        name="cvc"
                        showHint={this.state.showCvcHint}
                        value={cvc}
                        error={errors.cvc.message}
                      />
                    </div>
                    <div className="full">
                      <div className={cvcHintClassName}>
                        <img src="/images/CVC-illustration.png" className="left"/>
                        <div className="">{this.getIntlMessage('cvc_info')}</div>
                      </div>
                    </div>
                  </div>
                  <div className={creditCardErrorClassName}>
                    <div className="full">
                      <div id="amount-error-msg">
                        <ul id="parsley-id-multiple-donation_amount" className="parsley-errors-list filled">
                          <li className="parsley-custom-error-message">
                            {creditCardError}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <NextButton validate={["cardNumber", "expMonth", "expYear", "cvc"]}/>
              </div>
            </Page>

            <Page activePage={this.state.activePage} index={2} onError={this.onPageError} errors={[errors.code, errors.other]}>
              <SectionHeading>
                <h2>{this.getIntlMessage("personal")}</h2>
              </SectionHeading>
              <div className="row name-input">
                <div className="half">
                  <FirstName name="firstName" value={firstName}/>
                </div>
                <div className="half">
                  <LastName name="lastName" value={lastName}/>
                </div>
              </div>
              <div className="row address-input">
                <div className="base-line-address">
                  <div className="full">
                    <Country
                      name="country"
                      value={country}
                    />
                  </div>
                  <div className="full">
                    <Address
                      name="address"
                      value={address}
                    />
                  </div>
                  <div className="half">
                    <City
                      name="city"
                      value={city}
                    />
                  </div>
                  <div className="half">
                    <Code
                      name="code"
                      value={code}
                      error={codeError}
                    />
                  </div>
                  <div className="full">
                    <Province
                      name="province"
                      value={province}
                      country={country}
                    />
                  </div>
                </div>
                <div className="partial-address">
                  <div className="full">
                    <Country
                      name="country-test"
                      value={country}
                    />
                  </div>
                  <div className="full">
                    <Code
                      name="code-test"
                      value={code}
                      error={codeError}
                    />
                  </div>
                </div>
                <div className={addressErrorClassName}>
                  <div className="full">
                    <div id="amount-error-msg">
                      <ul id="parsley-id-multiple-donation_amount" className="parsley-errors-list filled">
                        <li className="parsley-custom-error-message">
                          {codeError}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <Email value={props.email} name="email" info={this.getIntlMessage("email_info")}/>
              <PrivacyPolicyCheckbox checked={props.privacyPolicy} name="privacyPolicy"/>
              <SignupCheckbox checked={props.signup} name="signup"/>

              <div className="base-line-address">
                {this.renderSubmitButton({
                  validate: ["firstName", "lastName", "country", "address", "city", "code", "province", "email", "privacyPolicy"],
                  submit: ["amount", "frequency", "cardNumber", "expMonth", "expYear", "cvc", "firstName", "lastName", "country", "address", "city", "code", "province", "email", "signup"]
                })}
              </div>
              <div className="partial-address">
                {this.renderSubmitButton({
                  validate: ["firstName", "lastName", "country-test", "code-test", "email", "privacyPolicy"],
                  submit: ["amount", "frequency", "cardNumber", "expMonth", "expYear", "cvc", "firstName", "lastName", "country-test", "code-test", "email", "signup"]
                })}
              </div>
            </Page>
          </NavigationContainer>

        </div>
        <SmallPrint stripeNotice={!this.state.hideCreditCardDetails}/>
        <Footer/>
      </div>
    );
  }
});
