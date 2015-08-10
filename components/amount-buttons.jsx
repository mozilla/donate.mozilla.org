import React from 'react';

var AmountButtons = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  getInitialState: function() {
    return {
      otherValue: "0"
    };
  },
  componentDidMount: function() {
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

    $("#amount-other-input").focus(function() {
      $(this).prevAll("input[type='radio']").click();
    });

    function updateAmountOptions(presetNum) {
      if (presetNum && AMOUNT_PRESET[presetNum]) {
        $("input[name='donation_amount']").each(function(idx) {
          if ($(this).attr("id") == "amount-other") {
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

    $("#amount-other-input")[0].addEventListener("input", function() {
      var amount = $('#amount-other-input').val();
      amountButtons.setState({
        otherValue: amount
      });
    });

    $("[name='donation_amount']").change(function(e) {
      if ($(this).attr("id") === 'amount-other') {
        $('#amount-other-input').attr('required', true).attr('data-parsley-required', "true");
      } else {
        $('#amount-other-input').attr('required', false).attr('data-parsley-required', "false");
      }
    });

    $("#amount-other-input").keydown(function(event) {
      var functionKeys = [8, 9, 13, 27, 37, 39, 46, 110, 190]; // backspace, tab, enter, escape, left arrow, right arrow, delete, decimal point, period
      var numberKeys = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105]; // numbers
      var allowed = functionKeys.concat(numberKeys);
      if (allowed.indexOf(event.keyCode) === -1) {
        event.preventDefault();
      }
    });

    // ***********************************************
    // Preselect dollar amount
    // ***********************************************
    function processAmountHash(winLocationHash) {
      var amtRegex = /#amount-([\w\.]+)/;
      var amount = winLocationHash.match(amtRegex)[1];
      if ($(winLocationHash)[0]) {
        $(winLocationHash)[0].checked = true;
      } else {
        $("#amount-other")[0].checked = true;
        $('#amount-other-input').val(amount);
      }
      history.replaceState({
        page: 1,
        hash: '#page-1'
      }, '', '#page-1');
      updateDonateButtonText(amount);
    }

    var winLocationHash = win.location.hash;
    if (winLocationHash.match(/#amount-\d+?/)) {
      processAmountHash(winLocationHash);
    } else if (winLocationHash.match(/#cc-amount-\d+?/)) {
      winLocationHash = winLocationHash.replace("cc-", "");
      processAmountHash(winLocationHash);
      history.pushState({
        page: 2,
        hash: '#page-2'
      }, '', '#page-2');
      $('#payment-cc').prop('checked', true);
      showCreditCardForm();
      hidePage('#page-1', 'complete');
      showPage('#page-2');
    } else {
      history.replaceState({
        page: 1,
        hash: '#page-1'
      }, '', '#page-1');
    }
  },
  render: function() {
    return (
      <div className="amount-buttons">
        <div className="row donation-amount-row hidden-visibility">
          <div className="third">
            <input type="radio" name="donation_amount" value="20" id="amount-20" data-parsley-multiple="donation_amount" data-parsley-group="page-1" data-parsley-errors-container="#amount-error-msg" data-parsley-error-message={this.getIntlMessage('please_select_an_amount')} data-parsley-required/>
            <label htmlFor="amount-20" className="large-label-size">$20</label>
          </div>
          <div className="third">
            <input type="radio" name="donation_amount" value="10" id="amount-10" data-parsley-multiple="donation_amount" data-parsley-group="page-1"/>
            <label htmlFor="amount-10" className="large-label-size">$10</label>
          </div>
          <div className="third">
            <input type="radio" name="donation_amount" value="5" id="amount-5" data-parsley-multiple="donation_amount" data-parsley-group="page-1"/>
            <label htmlFor="amount-5" className="large-label-size">$5</label>
          </div>
        </div>
        <div className="row donation-amount-row hidden-visibility">
          <div className="third">
            <input type="radio" name="donation_amount" value="3" id="amount-3" data-parsley-multiple="donation_amount" data-parsley-group="page-1"/>
            <label htmlFor="amount-3" className="large-label-size">$3</label>
          </div>
          <div className="two-third">
            <div id="amount-other-container">
              <input type="radio" name="donation_amount" value={this.state.otherValue} id="amount-other" data-parsley-multiple="donation_amount" data-parsley-group="page-1"/>
              <label htmlFor="amount-other" className="large-label-size">$</label>
              <input id="amount-other-input" placeholder={this.getIntlMessage('other_amount')} className="medium-label-size" data-parsley-multiple="donation_amount" data-parsley-group="page-1" data-parsley-errors-container="#amount-other-error-msg" data-parsley-type="number" data-parsley-check-amount data-parsley-min="2"/>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = AmountButtons;
