module.exports = {
  validateFields: function(fields) {
    var self = this;
    var valid = true;
    fields.forEach(function(field) {
      if (self.props.error[field] || !self.state.values[field]) {
        valid = false;
        var state = {};
        state[field + "Valid"] = valid;
        self.setState(state);
      }
    });
    return valid;
  },
  onInput: function(field, value) {
    var values = this.state.values;
    values[field] = value;
    var state = {
      values: values
    };
    state[field + "Valid"] = true;
    this.setState(state);
    this.onChange(field);
  },
  onChange: function(field) {
    this.props.onChange(this.props.name, this, field);
  },
  componentDidMount: function() {
    this.onChange();
  }
};
