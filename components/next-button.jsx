import React from 'react';
import { IntlMixin } from 'react-intl';
import dispatcher from '../scripts/dispatcher.js';

var NextButton = React.createClass({
  mixins: [IntlMixin],
  onClick: function() {
    dispatcher.fire("nextPage", {
      validate: this.props.validate
    });
  },
  render: function() {
    return (
      <button onClick={this.onClick} className="next-button">
        {this.getIntlMessage('next')}
        <div className="button-arrow"></div>
      </button>
    );
  }
});

module.exports = NextButton;
