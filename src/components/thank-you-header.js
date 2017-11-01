import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import locationSearchParser from '../lib/locationSearchParser.js';
import amountModifier from '../lib/amount-modifier.js';
import suggestMonthly from '../lib/suggest-monthly.js';

module.exports = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  /*

    Stripe calls this route as:

    /thank-you/? payment = Stripe
                &str_amount = number in "cents"
                &str_currency = currency id string
                &str_id = transaction id string
                &str_frequency = "one-time" or "monthly"
                &email = email string
                &country = full country name

    Paypal calls this route as:

    ...

  */  
  componentWillMount: function() {
    this.monthlyInvitation = null;

    let query = locationSearchParser(this.props.location);

    if (query && query.str_frequency === "one-time") {
      let currencyCode = query.str_currency;
      let trueAmount = amountModifier.reverse(
        query.str_amount,
        query.payment.toLowerCase(),
        currencyCode
      );
      let suggestion = suggestMonthly(trueAmount);

      this.monthlyInvitation = "/?fd=true&frequency=monthly&currency=" + currencyCode + "&amount=" + suggestion;
    }
  },  
  render: function() {
    return (
      <div>
        <div className="header baseline-header">
          <img width="68" height="62" className="auto-margin heart-image" src="/assets/images/heart.ce7d2d59c757e1598e244e546426577c.svg"/>
          { this.renderMessage() }
          { this.makeItMonthly() }
          <img width="280" height="115" className="auto-margin internet-graphic" src="/assets/images/internet-graphic.e9a5980f4251c71bdd72d088f80d9864.svg"/>
        </div>
        <div className="header new-header">
          <img width="100%" height="20%" className="auto-margin" id="heart-background" src="/assets/images/heart-bg.svg"/>
          <img width="25%" height="115" className="auto-margin" id="heart-gif" src="/assets/images/heart-sparkle.gif"/>
          {this.renderMessage()}
        </div>
      </div>
    );
  },
  renderMessage: function() {
    var name = this.props.name;
    if (name) {
      return (
        <h1>
          <FormattedHTMLMessage id="from_all_of_us_with_ty_name" values={{name}} />
        </h1>
      );
    }
    return (
      <span>
        <h1>
          <div>{ this.context.intl.formatMessage({id: "from_all_of_us_at_mozilla"}) }</div>
          <div><b>{ this.context.intl.formatMessage({id: "thank_you"}) }</b></div>
        </h1>
      </span>
    );
  },
  makeItMonthly: function() {
    let url = this.monthlyInvitation;

    if (!url) {
      return null;
    }

    return (
      <div className="monthly-invitation">
        ...maybe we could persuade you to turn that into <a href={url}>a monthly donation</a>?
      </div>
    )
  }

});
