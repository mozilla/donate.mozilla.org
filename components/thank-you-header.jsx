import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';

var ThankYouHeader  = React.createClass({
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
            values={{name: name}}
            id="from_all_of_us_with_ty_name"
          />
        </h1>
      );
    }
    return (
      <span>
        <h1>
          <div>{ this.context.intl.formatMessage({id: "from_all_of_us_at_mozilla"}) }</div>
          <div><b>{ this.context.intl.formatMessage({id: "thank_you"}) }</b></div>
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

module.exports = ThankYouHeader;
