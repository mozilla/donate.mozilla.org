import React from 'react';
import dispatcher from '../scripts/input-dispatcher.js';

module.exports = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  componentDidMount: function() {
    // Want to kill this, and make it a regular fieldChange
    dispatcher.fieldReady({
      name: this.props.name,
      element: this,
      field: "frequency"
    });
  },
  onChange: function(e) {
    dispatcher.fieldChange({
      field: "frequency",
      value: e.currentTarget.value
    });
    dispatcher.fire("frequencyChange", {
      frequency: e.currentTarget.value
    });
  },
  validate: function() {
    return true;
  },
  render: function() {
    var frequency = this.props.value;
    return (
      <div>
        <div className="row donation-frequency">
          <div className="half">
            <input name="recurring_acknowledge" checked={frequency !== "monthly"}
              onChange={this.onChange} type="radio" value="single" id="one-time-payment"
            />
            <label htmlFor="one-time-payment" className="medium-label-size">{this.getIntlMessage('one_time')}</label>
          </div>
          <div className="half">
            <input name="recurring_acknowledge" checked={frequency === "monthly"}
              onChange={this.onChange} type="radio" value="monthly" id="monthly-payment"
            />
            <label htmlFor="monthly-payment" className="medium-label-size">{this.getIntlMessage('monthly')}</label>
          </div>
        </div>
      </div>
    );
  }

});
