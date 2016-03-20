import React from 'react';
import Footer from './footer.jsx';

var MozillaFooter = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    return (
      <Footer message={ this.context.intl.formatMessage({id: "firefox_footer"}) } {...this.props}/>
    );
  }
});

module.exports = MozillaFooter;
