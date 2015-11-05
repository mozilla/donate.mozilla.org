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
import {Country, Address, Province, City, Code} from '../components/address-input.jsx';
import Email from '../components/email-input.jsx';
import {PrivacyPolicyCheckbox, SignupCheckbox} from '../components/checkbox.jsx';

import Error from '../components/error-message.jsx';

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
  renderSubmitButton: function(data) {
    var amount = this.state.props.amount;
    var currency = this.state.currency;

    return (
      <SubmitButton
        submitting={this.state.submitting}
        validate={data.validate}
        onSubmit={this.stripe}
        submit={data.submit}
        errors={[this.state.errors.required.message, this.state.errors.other.message]}
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
    var addressErrorClassName = "row error-msg-row";
    var codeError = this.state.errors.code.message;
    if (codeError === "") {
      addressErrorClassName += " hidden";
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
                onChange={this.updateFormField}
                amount={amount} presets={this.state.presets}
              />
              <Frequency onChange={this.onFrequencyChange} name="frequency" value={props.frequency}/>
              <NextButton validate={["amount"]}/>
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
                <Error message={this.state.errors.required.message}/>
                <NextButton validate={["creditCardInfo"]}/>
              </div>
            </Page>

            <Page activePage={this.state.activePage} index={2} onError={this.onPageError} errors={[this.state.errors.code, this.state.errors.other]}>
              <SectionHeading>
                <h2>{this.getIntlMessage("personal")}</h2>
              </SectionHeading>
              <Name onChange={this.onChange} name="name"/>
              <div className="row address-input">
                <div className="base-line-address">
                  <div className="full">
                    <Country
                      name="country"
                      onChange={this.updateFormField}
                      value={country}
                    />
                  </div>
                  <div className="full">
                    <Address
                      name="address"
                      onChange={this.updateFormField}
                      value={address}
                    />
                  </div>
                  <div className="half">
                    <City
                      name="city"
                      onChange={this.updateFormField}
                      value={city}
                    />
                  </div>
                  <div className="half">
                    <Code
                      name="code"
                      onChange={this.updateFormField}
                      value={code}
                      error={codeError}
                    />
                  </div>
                  <div className="full">
                    <Province
                      name="province"
                      onChange={this.updateFormField}
                      value={province}
                      country={country}
                    />
                  </div>
                </div>
                <div className="partial-address">
                  <div className="full">
                    <Country
                      name="country-test"
                      onChange={this.updateFormField}
                      value={country}
                    />
                  </div>
                  <div className="full">
                    <Code
                      name="code-test"
                      onChange={this.updateFormField}
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
              <Email onChange={this.onChange} name="email" info={this.getIntlMessage("email_info")}/>
              <PrivacyPolicyCheckbox onChange={this.onChange} name="privacyPolicy"/>
              <SignupCheckbox onChange={this.onChange} name="signup"/>

              <div className="base-line-address">
                {this.renderSubmitButton({
                  validate: ["name", "country", "address", "city", "code", "province", "email", "privacyPolicy"],
                  submit: ["amount", "frequency", "creditCardInfo", "name", "country", "address", "city", "code", "province", "email", "signup"]
                })}
              </div>
              <div className="partial-address">
                {this.renderSubmitButton({
                  validate: ["name", "country-test", "code-test", "email", "privacyPolicy"],
                  submit: ["amount", "frequency", "creditCardInfo", "name", "country-test", "code-test", "email", "signup"]
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
