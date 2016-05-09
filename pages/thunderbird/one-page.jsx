import React from 'react';
import ThunderbirdFooter from '../../components/thunderbird/footer.jsx';
import Header from '../../components/thunderbird/header.jsx';
import SmallPrint from '../../components/thunderbird/small-print.jsx';
import SingleForm from '../../components/single-form.jsx';

module.exports = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    var className = "row thunderbird";
    return (
      <div className={className}>
        <Header alt={this.context.intl.formatMessage({id: 'donate_to_thunderbird'})}></Header>
        <SingleForm
          appName="thunderbird"
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
