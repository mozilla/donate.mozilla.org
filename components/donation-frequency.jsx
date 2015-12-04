import React from 'react';
import listener from '../scripts/listener.js';
import form from '../scripts/form.js';
import helpsImageData from '../data/helps-image-data.js';

module.exports = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  propTypes: {
    name: React.PropTypes.string.isRequired,
    locale: React.PropTypes.string
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
    var locale = this.props.locale;
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
        {this.renderArrow()}
      </div>
    );
  }
});
