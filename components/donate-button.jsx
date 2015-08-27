import React from 'react';
import {FormattedMessage} from 'react-intl';

var DonateButton = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  onClick: function() {
    this.props.onSubmit(this.props.validate, this.props.submit);
  },
  render: function() {
    var message = this.getIntlMessage("donate_now");
    return (
      <div className="row">
        <div className="full">
          <button onClick={this.onClick} type="submit" className="btn large-label-size" id="donate-btn">
            { this.props.amount ?
            <FormattedMessage
              message={this.getIntlMessage('donate_now_amount')}
              currency_symbol="$"
              amount={this.props.amount}
              /> : message}
          </button>
        </div>
      </div>
    );
  }
});

module.exports = DonateButton;
