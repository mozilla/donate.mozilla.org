import React from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import SmallPrint from '../components/small-print.jsx';
import SingleForm from '../components/single-form.jsx';

var OnePage = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  getInitialState: function() {
    return {
      displayPopup: false
    };
  },
  displayMonthlyPopup: function(callback) {
    this.setState({
      displayPopup: true
    });
  },
  renderPopup: function() {
    if (this.state.displayPopup) {
      return (
        <div className="monthly-popup-cover">
          <div className="monthly-popup-container">
            
          </div>
        </div>
      );
    }
    return (
      <span></span>
    );
  },
  render: function() {
    var className = "row new-flow-test";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div className={className}>
        {this.renderPopup()}
        <Header locale={this.props.locales[0]} alt={this.getIntlMessage('donate_to_mozilla')}></Header>
        <SingleForm
          displayMonthlyPopup={this.displayMonthlyPopup}
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

module.exports = OnePage;
