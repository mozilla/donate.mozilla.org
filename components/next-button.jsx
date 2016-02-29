import React from 'react';
import { injectIntl } from 'react-intl';
import dispatcher from '../scripts/dispatcher.js';
import form from '../scripts/form.js';

var NextButton = injectIntl(React.createClass({
  propTypes: {
    validate: React.PropTypes.array.isRequired
  },
  onClick: function() {
    var valid = form.validate(this.props.validate);
    if (valid) {
      dispatcher.fire("nextPage");
    }
  },
  render: function() {
    return (
      <button onClick={this.onClick} className="next-button">
        {this.props.intl.formatMessage({id: 'next'})}
        <div className="button-arrow"></div>
      </button>
    );
  }
}));

module.exports = NextButton;
