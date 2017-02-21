import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
var createTestStore = require('./test-store.js');
import locales from '../../public/locales.json';

var ContextStub = React.createClass({
  getChildContext: function() {
    var Context = {
      messages: require('../../public/locales.json')["en-US"],
      router: {
        makeHref: function() {},
        createHref: function() {},
        makePath: function() {},
        transitionTo: function() {},
        replaceWith: function() {},
        goBack: function() {},
        getCurrentPath: function() {},
        getCurrentRoutes: function() {},
        getCurrentPathname: function() {},
        getCurrentParams: function() {},
        getCurrentQuery: function() {},
        isActive: function() {},
        render: function() {}
      }
    };
    return Context;
  },
  render: function() {
    var locale = this.props.locale || "en-US";
    var store = this.props.store || createTestStore({
      currency: this.props.currency,
      frequency: this.props.frequency,
      presets: this.props.presets,
      amount: this.props.amount
    });
    return (
      <Provider store={store}>
        <IntlProvider locale={locale} messages={locales[locale]}>{this.props.children}</IntlProvider>
      </Provider>
    );
  }
});

ContextStub.childContextTypes = {
  messages: React.PropTypes.object,
  router: React.PropTypes.object
};

module.exports = ContextStub;
