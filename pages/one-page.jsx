import React from 'react';
import MozillaFooter from '../components/mozilla/footer.jsx';
import Header from '../components/header.jsx';
import SmallPrint from '../components/small-print.jsx';
import SingleForm from '../components/single-form.jsx';

module.exports = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  render: function() {
    var className = "row";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div className={className}>
        <Header locale={this.props.locales[0]} alt={this.getIntlMessage('donate_to_mozilla')}></Header>
        <SingleForm
          billingAddress={true}
          currency={this.props.currency}
          presets={this.props.presets}
          amount={this.props.amount}
          frequency={this.props.frequency}
          country={this.props.country}
          locales={this.props.locales}
        />
        <SmallPrint stripeNotice={true}/>
        <MozillaFooter/>
      </div>
    );
  }
});
