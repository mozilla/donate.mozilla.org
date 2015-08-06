import React from 'react';

module.exports = React.createClass({

  mixins: [require('react-intl').IntlMixin],
  render: function() {
    return (
      <div>
        <div className="row" id="recurring-option-row">
          <div className="half">
            <input type="radio" name="recurring_acknowledge" value="0" defaultChecked="checked" id="one-time-payment" data-parsley-multiple="recurring_acknowledge" data-parsley-group="page-1" data-parsley-errors-container="#recurring-error-msg" data-parsley-required/>
            <label htmlFor="one-time-payment" className="medium-label-size">{this.getIntlMessage('one_time')}</label>
          </div>
          <div className="half">
            <input type="radio" name="recurring_acknowledge" value="1" id="monthly-payment" data-parsley-multiple="recurring_acknowledge" data-parsley-group="page-1"/>
            <label htmlFor="monthly-payment" className="medium-label-size">{this.getIntlMessage('monthly')}</label>
          </div>
        </div>
      </div>
    );
  }

});
