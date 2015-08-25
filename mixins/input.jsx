module.exports = {
  validateFields: function(fields) {
    var self = this;
    var valid = true;
    fields.forEach(function(field) {
      if (!self.state.values[field]) {
        valid = false;
        var state = {};
        state[field + "Valid"] = valid
        self.setState(state);
      }
    });
    return valid;
  },
  onInput: function(name, value) {
    var values = this.state.values;
    values[name] = value;
    var state = {
      values: values
    };
    state[name + "Valid"] = true;
    this.setState(state);
    this.onChange();
  },
  onChange: function() {
    this.props.onChange(this.props.name, this);
  },
  componentDidMount: function() {
    this.onChange();
  }
};
