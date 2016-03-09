import React from 'react';
import dispatcher from '../scripts/dispatcher.js';
import form from '../scripts/form.js';

var NextButton = React.createClass({
  propTypes: {
    validate: React.PropTypes.array.isRequired
  },
  contextTypes: {
    intl: React.PropTypes.object
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
        {this.context.intl.formatMessage({id: 'next'})}
        <div className="button-arrow"></div>
      </button>
    );
  }
});

module.exports = NextButton;
