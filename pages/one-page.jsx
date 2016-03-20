import React from 'react';
import MozillaFooter from '../components/footer-mozilla.jsx';
import Header from '../components/header.jsx';
import SmallPrint from '../components/small-print.jsx';
import SingleForm from '../components/single-form.jsx';

var OnePage = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  propTypes: {
    country: React.PropTypes.string.isRequired,
    currency: React.PropTypes.object.isRequired,
    amount: React.PropTypes.string.isRequired,
    presets: React.PropTypes.array.isRequired,
    test: React.PropTypes.string,
    frequency: React.PropTypes.string.isRequired
  },
  render: function() {
    var className = "row";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div className={className}>
        <Header alt={this.context.intl.formatMessage({id: 'donate_to_mozilla'})}></Header>
        <SingleForm
          billingAddress={true}
          currency={this.props.currency}
          presets={this.props.presets}
          amount={this.props.amount}
          frequency={this.props.frequency}
          country={this.props.country}
        />
        <SmallPrint stripeNotice={true}/>
        <MozillaFooter/>
      </div>
    );
  }
});

module.exports = OnePage;
