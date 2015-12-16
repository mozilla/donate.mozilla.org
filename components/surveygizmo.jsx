import React from 'react';

module.exports = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  render: function() {
    return (
      <div className="share-page">
        <div className="container">
          <iframe src="https://www.surveygizmo.com/s3/2472227/Mozilla-Donor-Survey" frameBorder="0" width="100%" height="600"></iframe>
        </div>
      </div>
    );
  }

});
