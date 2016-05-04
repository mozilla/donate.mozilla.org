import React from 'react';
import { IntlProvider } from 'react-intl';
import locales from '../../public/locales.json';

var IntlStub = React.createClass({
  render: function() {
    var locale = this.props.locale || "en-US";
    return (
      <IntlProvider locale={locale} messages={locales[locale]}>{this.props.children}</IntlProvider>
    );
  }
});
module.exports = IntlStub;
