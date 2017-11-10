import React from 'react';
import Modal from '../components/modal.js';

var MonthlyUpsell = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  getInitialState: function() {
    return ({
      inputValue: 10
    });
  },
  onInputChange: function(e) {
    var inputValue = e.currentTarget.value;
    var amount = "";

    if (/^[\d]*[\.]?\d{0,2}$/.test(inputValue)) {
      amount = inputValue.replace(/,/g, "");
    } else if (/^[\d]*[,]?\d{0,2}$/.test(inputValue)) {
      amount = inputValue.replace(/\./g, "").replace(",", ".");
    } else if (/^[\d,]*[\.]?\d{0,2}$/.test(inputValue)) {
      amount = inputValue.replace(/,/g, "");
    } else if (/^[\d\.]*[,]?\d{0,2}$/.test(inputValue)) {
      amount = inputValue.replace(/\./g, "").replace(",", ".");
    } else {
      inputValue = this.state.inputValue;
    }

    if (this.state.inputValue !== inputValue) {
      this.setState({
        inputValue: inputValue
      });
    }
  },
  render: function() {
    return (
      <div className="upsell-container">
        <Modal>
          <div className="upsell-modal">
            <p className="upsell-ask">
              Add a $<input value={this.state.inputValue} onChange={this.onInputChange}/> monthly donation starting next month?
            </p>
            <button className="yes-button">YES</button>
            <button className="no-button">NO</button>
          </div>
        </Modal>
      </div>
    );
  }
});

module.exports = MonthlyUpsell;
