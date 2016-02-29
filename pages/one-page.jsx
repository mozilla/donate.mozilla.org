import React from 'react';
import MozillaFooter from '../components/footer-mozilla.jsx';
import Header from '../components/header.jsx';
import SmallPrint from '../components/small-print.jsx';
import SingleForm from '../components/single-form.jsx';
import {injectIntl} from 'react-intl';

module.exports = injectIntl(React.createClass({
  render: function() {
    var className = "row";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div className={className}>
        <Header locale={this.props.intl.locale} alt={this.props.intl.formatMessage({id: 'donate_to_mozilla'})}></Header>
        <SingleForm
          billingAddress={true}
          currency={this.props.currency}
          presets={this.props.presets}
          amount={this.props.amount}
          frequency={this.props.frequency}
          country={this.props.country}
          locales={this.props.intl.locales}
        />
        <SmallPrint stripeNotice={true}/>
        <MozillaFooter/>
      </div>
    );
  }
}));
