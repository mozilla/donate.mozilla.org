import React from 'react';

var DonateButton = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  onClick: function() {
    this.props.onSubmit(this.props.validate, this.props.submit);
  },
  render: function() {
    var message = this.getIntlMessage("donate_now");
    if (this.props.display) {
      // Need to translate this.
      message = "Donate $" + this.props.display + " now";
    }
    return (
      <div className="row">
        <div className="full">
          <button onClick={this.onClick} type="submit" className="btn large-label-size" id="donate-btn">
            {message}
          </button>
        </div>
      </div>
    );
  }
});

module.exports = DonateButton;
