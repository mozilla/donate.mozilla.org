import React from 'react';
import dispatcher from '../scripts/input-dispatcher.js';

module.exports = React.createClass({
  getInitialState: function() {
    return {
      valid: true
    };
  },
  onInputChange: function(e) {
    this.setState({
      valid: true
    });
    dispatcher.fieldChange({
      field: this.props.name,
      value: e.currentTarget.value
    });
  },
  validate: function() {
    var valid = true;
    var value = this.props.value || "";
    value = value.trim();
    valid = !!value;
    this.setState({
      valid: valid
    });
    return valid;
  },
  componentDidMount: function() {
    dispatcher.fieldReady({
      name: this.props.name,
      element: this,
      field: this.props.name
    });
  },
  render: function() {
    var className;
    if (!this.state.valid || this.props.error) {
      className += " parsley-error";
    }
    return (
      <input
        autoComplete={this.props.autoComplete} autoCorrect={this.props.autoCorrect} autoCapitalize={this.props.autoCapitalize} spellCheck={this.props.spellCheck}
        className={className} type="text" name={this.props.name}
        onChange={this.onInputChange} value={this.props.value}
        placeholder={this.props.placeholder}
      />
    );
  }
});
