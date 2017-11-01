import React from 'react';
import reactGA from 'react-ga';
import { connect } from 'react-redux';
import { setNextmonth } from '../actions';

var DonationStart = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  onChange: function(e) {
    this.props.setNextmonth(e.currentTarget.value);
    reactGA.event({
      category: "User Flow",
      action: "Changed Start Of Monthly Donation",
      label: e.currentTarget.value
    });
  },
  validate: function() {
    return true;
  },
  render: function() {
    var nextmonth = this.props.nextmonth==="true";
    console.log("next month?", nextmonth);

    var inputName = "donation-start";
    var startNowId = "start-now";
    var deferId = "start-next-month";

    return (
      <div>
        <div className="row donation-start">
          <div className="start-radio">
            <input name={inputName} checked={!nextmonth} className="start-now"
              onChange={this.onChange} type="radio" value="false" id={startNowId}
            />
            <label htmlFor={startNowId} className="medium-label-size">
              { this.context.intl.formatMessage({id: 'start_now'}) }
            </label>
          </div>
          <div className="start-radio">
            <input name={inputName} checked={nextmonth} className="start-next-month"
              onChange={this.onChange} type="radio" value="true" id={deferId}
            />
            <label htmlFor={deferId} className="medium-label-size">
              { this.context.intl.formatMessage({id: 'start_next_month'}) }
            </label>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = connect(
function(state) {
  return {
    nextmonth: state.donateForm.nextmonth
  };
},
function(dispatch) {
  return {
    setNextmonth: function(data) {
      dispatch(setNextmonth(data));
    }
  };
})(DonationStart);
