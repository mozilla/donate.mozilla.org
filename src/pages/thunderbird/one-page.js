import React from 'react';
import ThunderbirdFooter from '../../components/thunderbird/footer.js';
import Header from '../../components/thunderbird/header.js';
import SmallPrint from '../../components/thunderbird/small-print.js';
import SingleForm from '../../components/single-form.js';

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
        />
        <SmallPrint/>
        <ThunderbirdFooter/>
      </div>
    );
  }
});
