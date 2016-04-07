import React from 'react';
import IntlMixin from 'react-intl';
import listener from '../scripts/listener.js';
import form from '../scripts/form.js';

module.exports = React.createClass({
  mixins: [IntlMixin],
  propTypes: {
    name: React.PropTypes.string.isRequired,
    field: React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string.isRequired,
    autoComplete: React.PropTypes.string,
    autoCorrect: React.PropTypes.string,
    spellCheck: React.PropTypes.string,
    autoCapitalize: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      value: "",
      valid: true,
      error: ""
    };
  },
  componentDidMount: function() {
    listener.on("formError", this.onError);
    listener.on("fieldUpdated", this.onFieldUpdated);
    form.registerField({
      name: this.props.name,
      element: this,
      field: this.props.field
    });
  },
  componentWillUnmount: function() {
    listener.off("formError", this.onError);
    listener.off("fieldUpdated", this.onFieldUpdated);
  },
  onError: function(e) {
    var detail = e.detail;
    var message = detail.message;
    var field = detail.field;
    var valid = !message;
    if (field === this.props.field) {
      this.setState({
        error: message,
        valid: valid
      });
    }
  },
  onFieldUpdated: function(e) {
    var detail = e.detail;
    if (detail.field === this.props.field) {
      this.setState({
        value: detail.value
      });
    }
  },
  onInputChange: function(e) {
    this.setState({
      valid: true
    });
    form.updateField(this.props.field, e.currentTarget.value);
  },
  validate: function() {
    var valid = true;
    var value = this.state.value || "";
    value = value.trim();
    if (!value) {
      form.error(this.props.field, this.getIntlMessage("please_complete"));
    }
    valid = !!value;
    this.setState({
      valid: valid
    });
    return valid;
  },
  render: function() {
    var className;
    if (!this.state.valid || this.state.error) {
      className += " parsley-error";
    }
    return (
      <input
        autoComplete={this.props.autoComplete} autoCorrect={this.props.autoCorrect} autoCapitalize={this.props.autoCapitalize} spellCheck={this.props.spellCheck}
        className={className} type="text" name={this.props.name}
        onChange={this.onInputChange} value={this.state.value}
        placeholder={this.props.placeholder}
      />
    );
  }
});
