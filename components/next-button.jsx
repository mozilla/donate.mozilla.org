import React from 'react';
import { IntlMixin } from 'react-intl';
import dispatcher from '../scripts/dispatcher.js';
import form from '../scripts/form.js';

var NextButton = React.createClass({
  mixins: [IntlMixin],
  onClick: function() {
    var valid = form.validate(this.props.validate);
    if (valid) {
      dispatcher.fire("nextPage");
    }
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
