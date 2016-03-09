import React from 'react';
import Input from './input.jsx';
import {IntlMixin} from 'react-intl';

var FirstName = React.createClass({
  mixins: [IntlMixin],
  propTypes: {
    name: React.PropTypes.string.isRequired
  },
  render: function() {
    return (
      <div className="field-container">
        <i className="fa fa-user field-icon"></i>
        <Input
          {...this.props}
          placeholder={this.getIntlMessage('first_name')}
          field="firstName"
          autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
        />
      </div>
    );
  }
});

var LastName = React.createClass({
  mixins: [IntlMixin],
  propTypes: {
    name: React.PropTypes.string.isRequired
  },
  render: function() {
    return (
      <div className="field-container">
        <Input
          {...this.props}
          placeholder={this.getIntlMessage('last_name')}
          field="lastName"
          autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
        />
      </div>
    );
  }
});

module.exports = {
  FirstName: FirstName,
  LastName: LastName
};
