import React from 'react';

var AmountButtons = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  componentDidMount: function() {
    var win = window,
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

    $("input#amount-other + label + input[name='donation_amount_other']").focus(function() {
      $(this).prevAll("input[type='radio']").click();
    });

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

    // ***********************************************
    // Preselect dollar amount
    // ***********************************************
    function processAmountHash(winLocationHash) {
      var amtRegex = /#amount-([\w\.]+)/;
      var amount = winLocationHash.match(amtRegex)[1];
      if ($(winLocationHash)[0]) {
        $(winLocationHash)[0].checked = true;
        $('input[name="donation_amount_other"]').val("");
      } else {
        $("#amount-other")[0].checked = true;
        $('input[name="donation_amount_other"]').val(amount);
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
              <input type="radio" name="donation_amount" value="other" id="amount-other" data-parsley-multiple="donation_amount" data-parsley-group="page-1"/>
              <label htmlFor="amount-other" className="large-label-size">$</label>
              <input name="donation_amount_other" placeholder={this.getIntlMessage('other_amount')} className="medium-label-size" data-parsley-multiple="donation_amount" data-parsley-group="page-1" data-parsley-errors-container="#amount-other-error-msg" data-parsley-type="number" data-parsley-check-amount data-parsley-min="2"/>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = AmountButtons;
