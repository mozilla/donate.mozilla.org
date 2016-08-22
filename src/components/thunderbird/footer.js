import React from 'react';
import Footer from '../footer.js';

var ThunderbirdFooter = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    return (
      <Footer message={ this.context.intl.formatMessage({id: "firefox_thunderbird_footer"}) } {...this.props}/>
    );
  }
});

module.exports = ThunderbirdFooter;
