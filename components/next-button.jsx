import React from 'react';
import { IntlMixin } from 'react-intl';

var NextButton = React.createClass({
  mixins: [IntlMixin],
  onClick: function() {
    this.props.onClick(this.props.validate);
  },
  render: function() {
    return (
      <div onClick={this.onClick} className="next-button">
        {this.getIntlMessage('next')}
      </div>
    );
  }
});

module.exports = NextButton;
