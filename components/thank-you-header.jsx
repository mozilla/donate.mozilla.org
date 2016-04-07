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
          <div>{ this.getIntlMessage("from_all_of_us_at_mozilla") }</div>
          <div><b>{ this.getIntlMessage("thank_you") }</b></div>
        </h1>
      </span>
    );
  },
  render: function() {
    return (
      <div className="header">
        <img width="68" height="62" className="heart-image" src="/assets/images/heart.ce7d2d59c757e1598e244e546426577c.svg"/>
        {this.renderMessage()}
        <img width="280" height="115" className="internet-graphic" src="/assets/images/internet-graphic.e9a5980f4251c71bdd72d088f80d9864.svg"/>
      </div>
    );
  }

});
