import React from 'react';
import Footer from '../footer.js';
import { FormattedHTMLMessage } from 'react-intl';

var MozillaFooter = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    return (
      <Footer {...this.props}>
        <FormattedHTMLMessage
          id='footer_updates'
        />
      </Footer>
    );
  }
});

module.exports = MozillaFooter;
