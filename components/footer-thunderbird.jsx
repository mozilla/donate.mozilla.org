import React from 'react';
import Footer from './footer.jsx';
import { IntlMixin } from 'react-intl';

var ThunderbirdFooter = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    return (
      <Footer message={ this.getIntlMessage("firefox_thunderbird_footer") } {...this.props}/>
    );
  }
});

module.exports = ThunderbirdFooter;
