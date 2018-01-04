import React from 'react';
import ErrorMessage from './error.js';
import { connect } from 'react-redux';
import { setEmail } from '../actions'; 

var EmailInput = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  onEmailChange: function(e) {
    this.props.setEmail(e.currentTarget.value);
  },
  componentDidMount: function() {
    // The browser may have a stored state here.
    // Ensure we are in sync with what the user sees.
    var email = this.inputElement.value;
    if (email) {
      this.props.setEmail(email);
    }
  },
  render: function() {
    var inputClassName = "";
    if (this.props.emailError) {
      inputClassName += "parsley-error";
    }

    return (
      <div className="email-input">
        <div className="row hint-msg-parent">
          <div className="full">
            <div className="field-container">
              <i className="fa fa-envelope field-icon"></i>
              <input type="email" name="email"
                ref={(input) => { this.inputElement = input; }}
                className={inputClassName} value={this.props.email}
                onChange={this.onEmailChange}
                placeholder={this.context.intl.formatMessage({id: 'email'})}
              />
            </div>
          </div>
        </div>

        <ErrorMessage message={this.props.emailError}/>
      </div>
    );
  }
});

module.exports = connect(
  function(state) {
    return {
      email: state.signupForm.email,
      emailError: state.signupForm.emailError
    };
  },
  function(dispatch) {
    return {
      setEmail: function(data) {
        dispatch(setEmail(data));
      }
    };
  }, null, {
    withRef: true
  })(EmailInput);
