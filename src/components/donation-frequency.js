import React from 'react';
import reactGA from 'react-ga';
import { connect } from 'react-redux';
import { setFrequency } from '../actions';

var DonationFrequency = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  onChange: function(e) {
    this.props.setFrequency(e.currentTarget.value);
    reactGA.event({
      category: "User Flow",
      action: "Changed Frequency",
      label: e.currentTarget.value
    });
  },
  validate: function() {
    return true;
  },
  render: function() {
    var frequency = this.props.frequency;
    var onTimeId = "one-time-payment-" + this.props.name;
    var monthlyId = "monthly-payment-" + this.props.name;
    var inputName = "recurring_acknowledge-" + this.props.name;
    return (
      <div>
        <div className="row donation-frequency">
          <div className="frequency-radio">
            <input name={inputName} autoComplete="off" checked={frequency !== "monthly"} className="one-time-payment"
              onChange={this.onChange} type="radio" value="single" id={onTimeId}
            />
            <label htmlFor={onTimeId} className="medium-label-size">{this.context.intl.formatMessage({id: 'one_time_uppercase'})}</label>
          </div>
          <div className="frequency-radio">
            <input name={inputName} autoComplete="off" checked={frequency === "monthly"} className="monthly-payment"
              onChange={this.onChange} type="radio" value="monthly" id={monthlyId}
            />
            <label htmlFor={monthlyId} className="medium-label-size">{this.context.intl.formatMessage({id: 'monthly_uppercase'})}</label>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = connect(
  function(state) {
    return {
      frequency: state.donateForm.frequency
    };
  },
  function(dispatch) {
    return {
      setFrequency: function(data) {
        dispatch(setFrequency(data));
      }
    };
  })(DonationFrequency);
