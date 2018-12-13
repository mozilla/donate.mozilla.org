import React from 'react';
import MozillaFooter from '../components/mozilla/footer.js';
import Header from '../components/header.js';
import SingleForm from '../components/single-form.js';

// NOTE: The main page is currently about.js, due to
//       A/B testing showing a more positive response
//       with the about page as initial landing page.

var onePage = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    var className = "row";
    return (
      <div className={className}>
        <Header alt={this.context.intl.formatMessage({id: 'donate_to_mozilla'})}></Header>
        <SingleForm
          test={this.props.test}
          subscribed={this.props.subscribed}
          currency={this.props.currency}
          presets={this.props.presets}
          amount={this.props.amount}
          frequency={this.props.frequency}
          country={this.props.country}
        />
        <MozillaFooter/>
      </div>
    );
  }
});

module.exports = onePage;
