import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';

module.exports = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  renderMessage: function() {
    var name = this.props.name;
    if (name) {
      return (
        <h1>
          <FormattedHTMLMessage
            id="from_all_of_us_with_ty_name"
            values={{name: name}}
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
      <div>
        <div className="header baseline-header">
          <img width="68" height="62" className="auto-margin homepage-image" src="/assets/images/heart.ce7d2d59c757e1598e244e546426577c.svg"/>
          {this.renderMessage()}
          <img width="280" height="115" className="auto-margin internet-graphic" src="/assets/images/internet-graphic.e9a5980f4251c71bdd72d088f80d9864.svg"/>
        </div>
        <div className="header new-header">
          <img width="100%" height="20%" className="auto-margin" id="heart-background" src="/assets/images/heart-bg.svg"/>
          <img width="25%" height="115" className="auto-margin" id="heart-gif" src="/assets/images/heart-sparkle.gif"/>
          {this.renderMessage()}
        </div>
      </div>
    );
  }

});
