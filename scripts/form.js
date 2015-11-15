import dispatcher from '../scripts/dispatcher.js';

var values = {};
var fields = {};
var elements = {};
var errors = {
  cardNumber: {
    page: 0,
    message: ""
  },
  cvc: {
    page: 0,
    message: ""
  },
  expMonth: {
    page: 0,
    message: ""
  },
  expYear: {
    page: 0,
    message: ""
  },
  code: {
    page: 0,
    message: ""
  },
  firstName: {
    page: 0,
    message: ""
  },
  lastName: {
    page: 0,
    message: ""
  },
  email: {
    page: 0,
    message: ""
  },
  address: {
    page: 0,
    message: ""
  },
  country: {
    page: 0,
    message: ""
  },
  province: {
    page: 0,
    message: ""
  },
  city: {
    page: 0,
    message: ""
  },
  code: {
    page: 0,
    message: ""
  },
  other: {
    page: 0,
    message: ""
  }
};

module.exports = {
  updateField: function(field, value) {
    values[field] = value;
    if (errors[field]) {
      this.error(field, "");
    }
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
  pageErrors: function(incoming, index) {
    incoming.forEach(function(error) {
      errors[error].page = index;
    });
  },
  error: function(field, message) {
    var error = errors[field];
    error.message = message;
    dispatcher.fire("toPage", {
      page: error.page
    });
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
