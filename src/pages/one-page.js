import React from 'react';
import MozillaFooter from '../components/mozilla/footer.js';
import Header from '../components/header.js';
import SingleForm from '../components/single-form.js';

var onePage = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    var className = "row";
    return (
      <div className={className}>
        <Header alt={this.context.intl.formatMessage({id: 'donate_to_mozilla'})}></Header>
        <SingleForm/>
        <MozillaFooter/>
      </div>
    );
  }
});

module.exports = onePage;
