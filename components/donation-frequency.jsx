import React from 'react';
import listener from '../scripts/listener.js';
import form from '../scripts/form.js';

module.exports = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  getInitialState: function() {
    return {
      frequency: ""
    };
  },
  componentDidMount: function() {
    listener.on("fieldUpdated", this.onFieldUpdated);
    form.registerField({
      name: this.props.name,
      element: this,
      field: "frequency"
    });
  },
  componentWillUnmount: function() {
    listener.off("fieldUpdated", this.onFieldUpdated);
  },
  onFieldUpdated: function(e) {
    var detail = e.detail;
    if (detail.field === "frequency") {
      this.setState({
        frequency: detail.value
      });
    }
  },
  onChange: function(e) {
    form.updateField("frequency", e.currentTarget.value);
  },
  validate: function() {
    return true;
  },
  render: function() {
    var frequency = this.state.frequency;
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
