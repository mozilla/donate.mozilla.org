import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';

var ThankYouHeaderThunder = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  propTypes: {
    name: React.PropTypes.string
  },
  renderMessage: function() {
    var name = this.props.name;
    if (name) {
      return (
        <h1>
          <FormattedHTMLMessage
            name={name}
            id="from_all_of_us_with_ty_name"
          />
        </h1>
      );
    }
    return (
      <span>
        <h1>
          <div>{ this.context.intl.formatMessage({ id: "from_all_of_us_at_thunderbird"}) }</div>
          <div><b>{ this.context.intl.formatMessage({ id: "thank_you"}) }</b></div>
        </h1>
      </span>
    );
  },
  render: function() {
    return (
      <div className="header">
        <img src="/assets/images/thunderbird/thunderbird-logo-wordmark.png" width="280" className="tb-logo" />
        {this.renderMessage()}
      </div>
    );
  }

});

module.exports = ThankYouHeaderThunder;

