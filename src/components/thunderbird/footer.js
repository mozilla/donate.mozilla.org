import React from 'react';
import Footer from '../footer.js';
import { FormattedHTMLMessage } from 'react-intl';

var ThunderbirdFooter = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    // We can customize the thunderbird message here if we want.
    return (
      <Footer {...this.props}>
        <FormattedHTMLMessage
          id='footer_updates'
        />
      </Footer>
    );
  }
});

module.exports = ThunderbirdFooter;
