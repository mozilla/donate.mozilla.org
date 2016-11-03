import React from 'react';
import { IntlProvider } from 'react-intl';

var createElement = React.createClass({
  propTypes: {
    locale: React.PropTypes.string.isRequired,
    messages: React.PropTypes.object.isRequired
  },
  render: function() {
    return (
      <IntlProvider locale={this.props.locale} messages={this.props.messages}>
        {this.props.children}
      </IntlProvider>
    );
  }
});

module.exports = createElement;
