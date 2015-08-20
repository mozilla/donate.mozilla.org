import React from 'react';

module.exports = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  getInitialState: function() {
    return {
      values: {
        recurring: 0,
        description: this.getIntlMessage("mozilla_donation")
      }
    };
  },
  onChange: function(e) {
    var recurring = e.currentTarget.value;
    var description = this.state.description;
    if (recurring) {
      description = this.getIntlMessage("mozilla_monthly_donation");
    }
    this.setState({
      values: {
        frequency: recurring,
        description: description
      }
    });
    this.props.onChange(this.props.name, this);
  },
  validate: function() {
    return true;
  },
  componentDidMount: function() {
    this.props.onChange(this.props.name, this);
  },
  render: function() {
    return (
      <div>
        <div className="row" id="recurring-option-row">
          <div className="half">
            <input name="recurring_acknowledge" onChange={this.onChange} type="radio" value="0" defaultChecked="checked" id="one-time-payment"/>
            <label htmlFor="one-time-payment" className="medium-label-size">{this.getIntlMessage('one_time')}</label>
          </div>
          <div className="half">
            <input name="recurring_acknowledge" onChange={this.onChange} type="radio" value="1" id="monthly-payment"/>
            <label htmlFor="monthly-payment" className="medium-label-size">{this.getIntlMessage('monthly')}</label>
          </div>
        </div>
      </div>
    );
  }

});
