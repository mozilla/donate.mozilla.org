import React from 'react';
import {IntlMixin} from 'react-intl';
import Error from '../components/error-message.jsx';

var DonateButton = React.createClass({
  mixins: [IntlMixin],
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
        <div className="full submit-button-container">
          <Error message={this.props.errors}/>
          <button onClick={this.onClick} type="submit" className="submit-btn large-label-size">
            {this.renderButton()}
          </button>
        </div>
      </div>
    );
  }
});

module.exports = DonateButton;
