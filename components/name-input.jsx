import React from 'react';
import Input from './input.jsx';

var FirstName = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired
  },
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    return (
      <div className="field-container">
        <i className="fa fa-user field-icon"></i>
        <Input
          {...this.props}
          placeholder={this.context.intl.formatMessage({id: 'first_name'})}
          field="firstName"
          autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
        />
      </div>
    );
  }
});

var LastName = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired
  },
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    return (
      <div className="field-container">
        <Input
          {...this.props}
          placeholder={this.context.intl.formatMessage({id: 'last_name'})}
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
