import React from 'react';
import {ErrorListener} from './error.jsx';

var DonateButton = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func,
    submitting: React.PropTypes.bool,
    validate: React.PropTypes.array.isRequired,
    submit: React.PropTypes.array.isRequired,
    errors: React.PropTypes.array,
    name: React.PropTypes.string
  },
  contextTypes: {
    intl: React.PropTypes.object
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
  render: function() {
    return (
      <div className="row submit-button">
        <div className="full submit-button-container">
          <ErrorListener errors={this.props.errors || []}/>
          <button onClick={this.onClick} name={this.props.name || "submit-button"} type="submit" className="submit-btn large-label-size">
            {this.renderButton()}
          </button>
        </div>
      </div>
    );
  }
});

module.exports = DonateButton;
