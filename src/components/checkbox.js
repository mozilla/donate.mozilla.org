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
  onChange: function(e) {
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  },
  render: function() {
    var errorMessage = this.props.error;
    return (
      <div className="full checkbox">
        <div className="row">
          <div className="full">
            <input type="checkbox"
              onChange={this.onChange} autoComplete="off"
              checked={this.props.checked}
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
