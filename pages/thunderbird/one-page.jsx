import React from 'react';
import ThunderbirdFooter from '../../components/footer-thunderbird.jsx';
import Header from '../../components/header-thunderbird.jsx';
import SmallPrint from '../../components/small-print-thunderbird.jsx';
import SingleForm from '../../components/single-form.jsx';

var ThunderbirdOnePage = React.createClass({
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
    var className = "row thunderbird";
    return (
      <div className={className}>
        <Header alt={this.context.intl.formatMessage({id: 'donate_to_thunderbird'})}></Header>
        <SingleForm
          appName="thunderbird"
          billingAddress={true}
          currency={this.props.currency}
          presets={this.props.presets}
          amount={this.props.amount}
          frequency={this.props.frequency}
          country={this.props.country}
        />
        <SmallPrint stripeNotice={true}/>
        <ThunderbirdFooter/>
      </div>
    );
  }
});

module.exports = ThunderbirdOnePage;
