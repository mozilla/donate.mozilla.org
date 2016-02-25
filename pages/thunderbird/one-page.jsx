import React from 'react';
import Footer from '../../components/footer.jsx';
import Header from '../../components/header-thunderbird.jsx';
import SmallPrint from '../../components/small-print-thunderbird.jsx';
import SingleForm from '../../components/single-form.jsx';

module.exports = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  render: function() {
    var className = "row thunderbird";
    return (
      <div className={className}>
        <Header locale={this.props.locales[0]} alt={this.getIntlMessage('donate_to_mozilla')}></Header>
        <SingleForm
          appName="thunderbird"
          billingAddress={true}
          currency={this.props.currency}
          presets={this.props.presets}
          amount={this.props.amount}
          frequency={this.props.frequency}
          country={this.props.country}
          locales={this.props.locales}
        />
        <SmallPrint stripeNotice={true}/>
        <Footer/>
      </div>
    );
  }
});
