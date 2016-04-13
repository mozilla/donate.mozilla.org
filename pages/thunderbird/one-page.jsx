import React from 'react';
import ThunderbirdFooter from '../../components/thunderbird/footer.jsx';
import Header from '../../components/thunderbird/header.jsx';
import SmallPrint from '../../components/thunderbird/small-print.jsx';
import SingleForm from '../../components/single-form.jsx';

module.exports = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  render: function() {
    var className = "row thunderbird";
    return (
      <div className={className}>
        <Header locale={this.props.locales[0]} alt={this.getIntlMessage('donate_to_thunderbird')}></Header>
        <SingleForm
          appName="thunderbird"
          currency={this.props.currency}
          presets={this.props.presets}
          amount={this.props.amount}
          frequency={this.props.frequency}
          country={this.props.country}
          locales={this.props.locales}
        />
        <SmallPrint locale={this.props.locales[0]} stripeNotice={true}/>
        <ThunderbirdFooter/>
      </div>
    );
  }
});
