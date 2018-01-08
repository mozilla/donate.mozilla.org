import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import ErrorMessage from './error.js';

var Checkbox = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  propTypes: {
    id: React.PropTypes.string.isRequired,
    intlId: React.PropTypes.string.isRequired,
    error: React.PropTypes.string,
    name: React.PropTypes.string
  },
  componentDidMount: function() {
    // The browser may have a stored state here.
    // Ensure we are in sync with what the user sees.
    var checked = this.inputElement.checked;
    if (checked && this.props.onChange) {
      this.props.onChange(checked);
    }
  },
  onChange: function(e) {
    if (this.props.onChange) {
      this.props.onChange(e.currentTarget.checked);
    }
  },
  render: function() {
    var errorMessage = this.props.error;
    return (
      <div className="full checkbox">
        <div className="row">
          <div className="full">
            <input type="checkbox"
              ref={(input) => { this.inputElement = input; }}
              onChange={this.onChange} checked={this.props.checked}
              name={this.props.name} id={this.props.id}
            />
            <label htmlFor={this.props.id}>
              <FormattedHTMLMessage id={ this.props.intlId } />
            </label>
          </div>
        </div>

        <ErrorMessage message={errorMessage}/>
      </div>
    );
  }
});

module.exports = Checkbox;
