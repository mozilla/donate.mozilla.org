import dispatcher from './dispatcher.js';

var values = {};
var fields = {};
var elements = {};

module.exports = {
  updateField: function(field, value) {
    values[field] = value;
    dispatcher.fire("fieldUpdated", {
      field: field,
      value: value
    });
  },
  registerField: function(detail) {
    var name = detail.name;
    var field = detail.field;
    var element = detail.element;
    elements[name] = element;
    fields[name] = field;
  },
  updateState: function(state, value) {
    dispatcher.fire("stateUpdated", {
      state: state,
      value: value
    });
  },
  error: function(field, message) {
    dispatcher.fire("formError", {
      field: field,
      message: message
    });
  },
  validate: function(props) {
    var valid = true;
    props = props || [];
    props.forEach(function(name) {
      if (!elements[name].validate()) {
        valid = false;
      }
    });
    return valid;
  },
  buildProps: function(incoming) {
    var props = {};
    incoming.forEach(function(name) {
      props[fields[name]] = values[fields[name]];
    });
    return props;
  }
};
