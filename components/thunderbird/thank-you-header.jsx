import React from 'react';
import { IntlMixin, FormattedHTMLMessage } from 'react-intl';

module.exports = React.createClass({
  mixins: [IntlMixin],
  renderMessage: function() {
    var name = this.props.name;
    if (name) {
      return (
        <h1>
          <FormattedHTMLMessage
            name={name}
            message={ this.getIntlMessage("from_all_of_us_with_ty_name") }
          />
        </h1>
      );
    }
    return (
      <span>
        <h1>
          <div>{ this.getIntlMessage("from_all_of_us_at_thunderbird") }</div>
          <div><b>{ this.getIntlMessage("thank_you") }</b></div>
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
