import React from 'react';
import listener from '../scripts/listener.js';
import form from '../scripts/form.js';
import helpsImageData from '../data/helps-image-data.js';

module.exports = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    locale: React.PropTypes.string
  },
  contextTypes: {
    intl: React.PropTypes.object
  },
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
  renderArrow: function() {
    var locale = this.context.intl.locale;
    var fileName = helpsImageData[locale];
    if (fileName && this.state.frequency !== "monthly") {
      return (
        <img width="250" height="73" className="this-really-helps-img" src={"/assets/images/" + fileName}/>
      );
    }
    return (
      <span></span>
    );
  },
  render: function() {
    var frequency = this.state.frequency;
    var onTimeId = "one-time-payment-" + this.props.name;
    var monthlyId = "monthly-payment-" + this.props.name;
    var inputName = "recurring_acknowledge-" + this.props.name;
    return (
      <div>
        <div className="row donation-frequency">
          <div className="frequency-radio">
            <input name={inputName} checked={frequency !== "monthly"} className="one-time-payment"
              onChange={this.onChange} type="radio" value="single" id={onTimeId}
            />
            <label htmlFor={onTimeId} className="medium-label-size">{this.context.intl.formatMessage({id: 'one_time'})}</label>
          </div>
          <div className="frequency-radio">
            <input name={inputName} checked={frequency === "monthly"} className="monthly-payment"
              onChange={this.onChange} type="radio" value="monthly" id={monthlyId}
            />
            <label htmlFor={monthlyId} className="medium-label-size">{this.context.intl.formatMessage({id: 'monthly'})}</label>
          </div>
        </div>
        {this.renderArrow()}
      </div>
    );
  }
});
