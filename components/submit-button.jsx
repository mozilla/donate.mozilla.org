import React from 'react';
import {IntlMixin} from 'react-intl';
import {ErrorListener} from './error.jsx';

var DonateButton = React.createClass({
  mixins: [IntlMixin],
  propTypes: {
    onClick: React.PropTypes.func,
    submitting: React.PropTypes.bool,
    validate: React.PropTypes.array.isRequired,
    submit: React.PropTypes.array.isRequired,
    errors: React.PropTypes.array,
    name: React.PropTypes.string
  },
  onClick: function() {
    this.props.onSubmit(this.props.validate, this.props.submit);
  },
  renderButton: function() {
    if (this.props.submitting) {
      return (
        <span><i className="fa fa-cog fa-spin"/>{this.getIntlMessage('submitting')}</span>
      );
    }
    return this.props.children;
  },
  render: function() {
    return (
      <div className="row submit-button">
        <ErrorListener errors={this.props.errors || []}/>
        <div className="full">
          <button onClick={this.onClick} name={this.props.name || "submit-button"} type="submit" className="submit-btn large-label-size">
            {this.renderButton()}
          </button>
        </div>
      </div>
    );
  }
});

module.exports = DonateButton;
