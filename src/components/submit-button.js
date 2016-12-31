import React from 'react';
import {ErrorListener} from './error.js';

var DonateButton = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  propTypes: {
    onClick: React.PropTypes.func,
    submitting: React.PropTypes.bool,
    validate: React.PropTypes.array.isRequired,
    submit: React.PropTypes.array.isRequired,
    errors: React.PropTypes.array,
    name: React.PropTypes.string
  },
  onClick: function() {
    if (!this.props.submitting) {
      this.props.onSubmit(this.props.validate, this.props.submit);
    }
  },
  renderButton: function() {
    if (this.props.submitting) {
      return (
        <span><i className="fa fa-cog fa-spin"/>{this.context.intl.formatMessage({id: 'submitting'})}</span>
      );
    }
    return this.props.children;
  },
  componentDidMount: function() {
    // Need this because Chrome on iOS plus StripeCheckout triggers a popup.
    // We need to ensure the popup isn't blocked.
    this.submitButton.addEventListener("click", this.onClick);
  },
  componentWillUnmount: function() {
    // Need to ensure we remove it, or else we'll have a memory leak.
    // This is why you don't use DOM events in React.
    this.submitButton.removeEventListener("click", this.onClick);
  },
  render: function() {
    return (
      <div className="row submit-button">
        <div className="full submit-button-container">
          <ErrorListener errors={this.props.errors || []}/>
          <button ref={(button) => { this.submitButton = button; }} name={this.props.name || "submit-button"} type="submit" className="submit-btn large-label-size">
            {this.renderButton()}
          </button>
        </div>
      </div>
    );
  }
});

module.exports = DonateButton;
