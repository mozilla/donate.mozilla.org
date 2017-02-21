import React from 'react';
import { IntlProvider } from 'react-intl';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from '../reducers';

var createElement = React.createClass({
  propTypes: {
    locale: React.PropTypes.string.isRequired,
    messages: React.PropTypes.object.isRequired
  },
  render: function() {
    return (
      <Provider store={createStore(reducer, {
        donateForm: {
          currency: this.props.currency,
          frequency: this.props.frequency,
          presets: this.props.presets,
          amount: this.props.amount
        }
      })}>
        <IntlProvider locale={this.props.locale} messages={this.props.messages}>
          {this.props.children}
        </IntlProvider>
      </Provider>
    );
  }
});

module.exports = createElement;
