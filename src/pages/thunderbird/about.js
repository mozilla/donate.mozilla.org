import React from 'react';
import ThunderbirdFooter from '../../components/thunderbird/footer.js';
import SingleForm from '../../components/single-form.js';

module.exports = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    var className = "row additional-info-container thunderbird";
    return (
      <div className={className}>
        <div className="additional-info-page">
          <div className="container additional-page">
            <img className="internet-graphic" width="224" src="/assets/images/thunderbird/thunderbird-logo-wordmark-small.png"/>
            <div>{this.context.intl.formatMessage({id: 'additional_info_thunderbird'})}</div>
          </div>
          <SingleForm
            appName="thunderbird"
          />
        </div>
        <ThunderbirdFooter/>
      </div>
    );
  }
});
