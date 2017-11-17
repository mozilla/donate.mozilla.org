import React from 'react';
import MozillaFooter from '../components/mozilla/footer.js';
import Signup from '../components/signup.js';
import Social from '../components/social.js';
import ThankYouHeader from '../components/thank-you-header.js';
import analytics from '../lib/analytics.js';
import MonthlyUpsell from '../components/monthly-upsell.js';
import locationSearchParser from '../lib/location-search-parser.js';
import amountModifier from '../lib/amount-modifier.js';
import suggestMonthly from '../lib/suggest-monthly.js';

var ThankYou = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  getInitialState: function() {
    let query = locationSearchParser(this.props.location);
    if (/^(en)(\b|$)/.test(this.context.intl.locale)) {
      if (query && query.str_frequency === "one-time") {
        let trueAmount = amountModifier.reverse(
          query.str_amount,
          query.payment.toLowerCase(),
          query.str_currency
        );
        let suggestedMonthly = suggestMonthly(trueAmount, query.str_currency);
        if (suggestedMonthly) {
          return {
            showMonthlyUpsell: true,
            suggestedMonthly,
            currencyCode: query.str_currency,
            customerId: query.customer_id
          };
        }
      }
    }
    return {
      showMonthlyUpsell: false
    };
  },
  componentDidMount: function() {
    analytics();
  },
  closeMonthlyUpsell: function() {
    this.setState({
      showMonthlyUpsell: false
    });
  },
  render: function() {
    var className = "row thank-you-page";
    var signUpOrSocial = (<Social/>);
    var monthlyUpsell = null;
    if (this.state.showMonthlyUpsell) {
      monthlyUpsell = (
        <MonthlyUpsell
          customerId={this.state.customerId}
          currencyCode={this.state.currencyCode}
          onClose={this.closeMonthlyUpsell}
          suggestedMonthly={this.state.suggestedMonthly}
        />
      );
    }
    if (/^(en|de|es|fr|pl|pt-BR)(\b|$)/.test(this.context.intl.locale)) {
      signUpOrSocial = (<Signup country={this.props.country} email={this.props.email}/>);
    }
    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div>
        <div className={className}>
          <ThankYouHeader/>
          {monthlyUpsell}
          <div>
            {signUpOrSocial}
            <MozillaFooter/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ThankYou;
