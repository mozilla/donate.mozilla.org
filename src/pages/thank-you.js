import React from 'react';
import MozillaFooter from '../components/mozilla/footer.js';
import Signup from '../components/signup.js';
import Social from '../components/social.js';
import ThankYouHeader from '../components/thank-you-header.js';
import analytics from '../lib/analytics.js';
import MonthlyUpsell from '../components/monthly-upsell.js';
import locationSearchParser from '../lib/location-search-parser.js';

var ThankYou = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  getInitialState: function() {
    var showMonthlyUpsell = false;
    let query = locationSearchParser(this.props.location);
    if (query && query.str_frequency === "one-time"
        && (query.str_currency === "usd"
         || query.str_currency === "eur"
         || query.str_currency === "cad"
         || query.str_currency === "aus"
         || query.str_currency === "gbp"))
    {
      showMonthlyUpsell = true;
    }
    return {
      showMonthlyUpsell,
      query
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
        <MonthlyUpsell query={this.state.query} onClose={this.closeMonthlyUpsell}/>
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
