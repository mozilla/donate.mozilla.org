import React from 'react';

var AmountButtons = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  getInitialState: function() {
    return {
      otherAmount: "",
      amount: "",
      values: {
        amount: "",
        currencyCode: "USD"
      },
      valid: true
    };
  },
  onChange: function(e) {
    var amount = e.currentTarget.value;
    this.setState({
      values: {
        amount: amount,
        currencyCode: this.state.values.currencyCode
      },
      amount: amount
    });
    this.setAmount();
  },
  onOtherChange: function() {
    this.setState({
      amount: "",
      values: {
        amount: this.state.otherAmount,
        currencyCode: this.state.values.currencyCode
      }
    });
    this.setAmount();
  },
  setAmount: function() {
    this.setState({
      valid: true
    });
    this.props.onChange(this.props.name, this);
  },
  otherRadioClick: function() {
    document.querySelector("#amount-other-input").focus();
  },
  otherInputClick: function() {
    document.querySelector("#amount-other").click();
  },
  validate: function() {
    var valid = false;
    if (this.state.values.amount) {
      valid = true;
    }
    this.setState({
      valid: valid
    });
    return valid;
  },
  componentDidMount: function() {
    this.props.onChange(this.props.name, this);

    // Remove all the below code, shared.less, and previous sequential.jsx
    var win = window,
        amountButtons = this,
        AMOUNT_SET_PARAM = "preset",
        AMOUNT_PRESET = {
          2: [100, 50, 25, 15]
        };

    // extract query param from url
    // code modified from: http://www.sitepoint.com/url-parameters-jquery/
    $.urlParam = function(name) {
      var results =
        new RegExp('[\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
      return results ? results[1] : null;
    };

    function updateAmountOptions(presetNum) {
      if (presetNum && AMOUNT_PRESET[presetNum]) {
        $("input[name='donation_amount']").each(function(idx) {
          if ($(this).attr("id") === "amount-other") {
            return;
          }
          var selectedPreset = AMOUNT_PRESET[presetNum];
          var newAmount = selectedPreset[idx];
          $(this).attr({
            id: "amount-" + newAmount,
            value: newAmount
          });
          $(this).siblings("label").attr({
            for: $(this).attr("id")
          });
          $(this).siblings("label").text("$" + newAmount);
        });
      }
      // amount options have been updated, now show them to users
      $(".row.donation-amount-row").removeClass("hidden-visibility");
    }

    updateAmountOptions($.urlParam(AMOUNT_SET_PARAM));

    document.querySelector("#amount-other-input").addEventListener("input", function() {
      var amount = document.querySelector('#amount-other-input').value;
      amountButtons.setState({
        otherAmount: amount
      });
    });

    $("#amount-other-input").keydown(function(event) {
      var functionKeys = [8, 9, 13, 27, 37, 39, 46, 110, 190]; // backspace, tab, enter, escape, left arrow, right arrow, delete, decimal point, period
      var numberKeys = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105]; // numbers
      var allowed = functionKeys.concat(numberKeys);
      if (allowed.indexOf(event.keyCode) === -1) {
        event.preventDefault();
      }
    });
  },
  render: function() {
    var otherAmount = this.state.otherAmount;
    if (this.state.amount) {
      otherAmount = "";
    }
    var errorMessageClassName = "row error-msg-row";
    if (this.state.valid) {
      errorMessageClassName += " hidden";
    }
    return (
      <div className="amount-buttons">
        <div className="row donation-amount-row hidden-visibility">
          <div className="third">
            <input onChange={this.onChange} type="radio" name="donation_amount" value="20" id="amount-20"/>
            <label htmlFor="amount-20" className="large-label-size">$20</label>
          </div>
          <div className="third">
            <input onChange={this.onChange} type="radio" name="donation_amount" value="10" id="amount-10"/>
            <label htmlFor="amount-10" className="large-label-size">$10</label>
          </div>
          <div className="third">
            <input onChange={this.onChange} type="radio" name="donation_amount" value="5" id="amount-5"/>
            <label htmlFor="amount-5" className="large-label-size">$5</label>
          </div>
        </div>
        <div className="row donation-amount-row hidden-visibility">
          <div className="third">
            <input onChange={this.onChange} type="radio" name="donation_amount" value="3" id="amount-3"/>
            <label htmlFor="amount-3" className="large-label-size">$3</label>
          </div>
          <div className="two-third">
            <div id="amount-other-container">
              <input onClick={this.otherRadioClick} onChange={this.onOtherChange} type="radio" name="donation_amount" value={otherAmount} id="amount-other"/>
              <label htmlFor="amount-other" className="large-label-size">$</label>
              <input onClick={this.otherInputClick} onChange={this.onOtherChange} type="text" id="amount-other-input" placeholder={this.getIntlMessage('other_amount')} className="medium-label-size" value={otherAmount}/>
            </div>
          </div>
        </div>
        <div className={errorMessageClassName}>
          <div className="full">
            <div id="amount-error-msg">
              <ul id="parsley-id-multiple-donation_amount" className="parsley-errors-list filled">
                <li className="parsley-custom-error-message">{this.getIntlMessage('please_select_an_amount')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = AmountButtons;

