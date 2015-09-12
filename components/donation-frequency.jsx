import React from 'react';

module.exports = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  componentDidMount: function() {
    this.updateFrequency(this.props.value);
  },
  onChange: function(e) {
    var value = "single";
    if (e.currentTarget.value === "1") {
      value = "monthly";
    }
    this.updateFrequency(value);
  },
  updateFrequency: function(value) {
    var frequency = value;
    var description = this.getIntlMessage("mozilla_donation");
    if (frequency === "monthly") {
      description = this.getIntlMessage("mozilla_monthly_donation");
    }
    this.props.onChange(this.props.name, this, {
      frequency: frequency,
      description: description
    });
  },
  validate: function() {
    return true;
  },
  render: function() {
    var frequency = this.props.value;
    return (
      <div>
        <div className="row" id="recurring-option-row">
          <div className="half">
            <input name="recurring_acknowledge" checked={frequency !== "monthly"}
              onChange={this.onChange} type="radio" value="0" id="one-time-payment"
            />
            <label htmlFor="one-time-payment" className="medium-label-size">{this.getIntlMessage('one_time')}</label>
          </div>
          <div className="half">
            <input name="recurring_acknowledge" checked={frequency === "monthly"}
              onChange={this.onChange} type="radio" value="1" id="monthly-payment"
            />
            <label htmlFor="monthly-payment" className="medium-label-size">{this.getIntlMessage('monthly')}</label>
          </div>
        </div>
      </div>
    );
  }

});
