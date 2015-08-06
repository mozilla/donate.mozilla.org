import React from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import Link from '../components/link.jsx';
import { FormattedHTMLMessage, IntlMixin } from 'react-intl';
import CTA from '../components/CTA.jsx';
import Frequency from '../components/donation-frequency.jsx';

var ga = require('react-ga');

var Sequential = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      country: "US",
      province: ""
    };
  },
  onCountryChange: function(event) {
    this.setState({
      country: event.target.value
    });
  },
  onProvinceChange: function(event) {
    this.setState({
      province: event.target.value
    });
  },
  componentDidMount: function() {

    var
      $theForm = $("#donation-form-sequential"),
      win = window,
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

    $(win).on('load', function() {
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
    });


    // ***********************************************
    // UI related
    // ***********************************************
    $(".cc-additional-info").hide();
    $(".hint-msg").hide();

    $("#donation-form input, #donation-form select").focus(function() {
      $(this).siblings("i.fa.field-icon").addClass("icon-in-focus");
    });
    $("#donation-form input, #donation-form select").blur(function() {
      $(this).siblings("i.fa.field-icon").removeClass("icon-in-focus");
    });

    // Clickable progress dot
    $(".progress").on("click", "li", function() {
      var dotSelected = $(this).data("position").replace("#page-", "");
      var currentPage = $(".progress li.active").data("position").replace("#page-", "");
      if (dotSelected < currentPage) {
        window.history.go(dotSelected - currentPage);
        if (dotSelected - currentPage == -2) {
          hidePage('#page-3', 'incomplete');
        }
      }
    });

    function calculateHeight() {
      if (!win.location.hash) {
        return;
      }
      $('#donation-form-sequential').height($(win.location.hash).height() + 145);
    }

    function showCreditCardForm() {
      $(".cc-additional-info").slideDown(100);
      $(".stripe-notice").show();
      win.setTimeout(function() {
        calculateHeight();
        $('[name="cc_number"]').focus();
      }, 100);
      if ($(".parsley-error").length > 0) {
        $("#one-line-error").show();
      }
    }

    $("#payment-cc").change(showCreditCardForm);
    $("#payment-paypal").change(function() {
      // reset
      $(".cc-additional-info").hide();
      calculateHeight();
      $("#one-line-error").hide();
      if ($('[name="recurring_acknowledge"]:checked').val() === '0') {
        $('#paypal-one-time').submit();
      } else {
        $('#paypal-recurring').submit();
      }
    });

    $(win).on('resize', calculateHeight);

    $("input#amount-other + label + input[name='donation_amount_other']").focus(function() {
      $(this).prevAll("input[type='radio']").click();
    });

    $("i.hint").click(function() {
      $(this).toggleClass("on");
      $(this).parents(".hint-msg-parent").find(".hint-msg").toggle();
      calculateHeight();
    });


    // ***********************************************
    // Generate state & country dropdown.
    // This basically copies the BSD generated DOM.
    // ***********************************************
    function generateStateDropdown() {
      var selectedCountry = $theForm.find("select[name='country']").val();
      var optgroup = $("select[data-country='" + selectedCountry + "'] optgroup");
      var stateDropdown = $theForm.find('select[name="state_cd"]');
      stateDropdown.find("optgroup").remove();
      stateDropdown.removeClass("normalTextColor");
      stateDropdown.find("option[data-value='none']").remove();
      if (optgroup.length) {
        stateDropdown.val("");
        stateDropdown.append(optgroup.clone());
        stateDropdown.prop("required", true);
        stateDropdown.show();
      } else {
        var noneoptions = $("select[data-country='none'] option");
        var clonedOptions = noneoptions.clone();
        stateDropdown.append(clonedOptions);
        stateDropdown.find("option:selected").removeAttr("selected");
        clonedOptions.prop("selected", true);
        stateDropdown.prop("required", false);
        stateDropdown.hide();
      }
    }


    function generateCountryDropdown() {
      $theForm.find("select[name='country'] option:selected").removeAttr("selected");
      $theForm.find("select[name='country'] option:first-child").html("Country");
      $theForm.find("select[name='country']").val("US").addClass("normalTextColor");
      $theForm.find("select[name='country']").change(function() {
        var selected = $(this).val();
        generateStateDropdown();
        if (selected) {
          $(this).addClass("normalTextColor");
        } else {
          $(this).removeClass("normalTextColor");
        }
      });
    }
    generateCountryDropdown();
    generateStateDropdown();

    $theForm.find('select[name="state_cd"]').change(function() {
      var selected = $(this).val();
      if (selected) {
        $(this).addClass("normalTextColor");
      } else {
        $(this).removeClass("normalTextColor");
      }
    });

    // ***********************************************
    // Update Donate button to make it show the selected donation amount
    // ***********************************************
    var updateDonateButtonText = function(amountSelected) {
      var buttonText;
      if (amountSelected == "other") {
        amountSelected = $theForm.find("[name='donation_amount_other']").val();
      }
      var locale = "US";
      if (amountSelected && locale === "US") {
        buttonText = "Donate $" + amountSelected + " now";
      } else {
        buttonText = this.getIntlMessage("donate_now");
      }
      $("#donate-btn").text(buttonText);
      $('#paypal-one-time').find('[name="amount"]').attr('value', amountSelected);
      $('#paypal-recurring').find('[name="amount"]').attr('value', amountSelected);
    };

    $theForm.find("[name='donation_amount']").change(function() {
      updateDonateButtonText($(this).val());
    });
    $theForm.find("[name='donation_amount']").change(function(e) {
      if ($(this).val() !== 'other') {
        $('input[name="donation_amount_other"]').attr('required', false).attr('data-parsley-required', "false");
      }
    });

    $theForm.find("[name='donation_amount_other']").keyup(function() {
      updateDonateButtonText($(this).val());
    });
    $theForm.find("[name='donation_amount']").change(function() {
      $theForm.find("[name='donation_amount_other']").val("");
    });
    $theForm.find("[name='donation_amount_other']").keydown(function(event) {
      var functionKeys = [8, 9, 13, 27, 37, 39, 46, 110, 190]; // backspace, tab, enter, escape, left arrow, right arrow, delete, decimal point, period
      var numberKeys = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105]; // numbers
      var allowed = functionKeys.concat(numberKeys);
      if (allowed.indexOf(event.keyCode) === -1) {
        event.preventDefault();
      }
    });

    // ***********************************************
    // Program next links and back button
    // ***********************************************

    function hidePage(page, status) {
      $(page).addClass('page-hidden-' + status).prop('disabled', true);
      var amount;
      if (page === "#page-1") {
        if (status === "complete") {
          amount = "$" + $('#paypal-one-time').find('[name="amount"]').attr('value');
          $("[data-position='#page-1'] .page-breadcrumb").text(amount);
        } else {
          $("[data-position='#page-1'] .page-breadcrumb").text("");
        }
      } else if (page === "#page-2") {
        if (status === "complete") {
          $("[data-position='#page-2'] .page-breadcrumb").text("Credit card");
        } else {
          $("[data-position='#page-2'] .page-breadcrumb").text("");
        }
      }
      win.setTimeout(function() {
        $(page).addClass('hidden');
      }, 501);
    }

    function showPage(page) {
      $('ol.progress').find('li').removeClass('active');
      $('ol.progress').find('li[data-position="' + page + '"]').addClass('active');

      $("[data-position='" + page + "'] .page-breadcrumb").text("");

      $(page).removeClass('hidden');
      $(page).prop('disabled', false);
      win.setTimeout(function() {
        $(page).removeClass('page-hidden-incomplete').removeClass('page-hidden-complete');
      }, 100);

      calculateHeight();

      // Reset progress bar dots' cursor type accordlying
      $(".progress li").css({
        cursor: "default"
      });
      $(".progress li.active").prevAll("li").css({
        cursor: "pointer"
      });

      // These are virtual pageviews, so we track them manually in GA
      var currentPage = window.location.pathname;
      ga.pageview(currentPage + page);
    }

    $theForm.on('click', '[data-button-type="next"]', function(e) {
      e.preventDefault();
      $('#one-line-error').hide();

      if ($('input[name="donation_amount"]:checked').val() === 'other') {
        $('input[name="donation_amount_other"]').attr('required', true);
      }

      var
        $context = $(this),
        current = $context.data('page'),
        next = current + 1;
      if ($theForm.parsley().isValid('page-' + current)) {
        history.pushState({
          hash: '#page-' + next,
          page: next
        }, '', $context.prop('href'));
        hidePage('#page-' + current, 'complete');
        showPage('#page-' + next);
      } else {
        $theForm.parsley().validate('page-' + current);
        calculateHeight();
      }
    });

    win.onpopstate = function(e) {

      $('#one-line-error').hide();
      if (e.state.page !== null) {
        hidePage('#page-' + (e.state.page - 1), 'complete');
        hidePage('#page-' + (e.state.page + 1), 'incomplete');
      } else {
        hidePage('#page-2', 'incomplete');
        hidePage('#page-3', 'incomplete');
      }
      history.replaceState({
        page: e.state.page,
        hash: e.state.hash
      }, '', e.state.hash);
      showPage(e.state.hash);
    };

    // ***********************************************
    // Parsley.js setting & client side validation etc
    // API: http://parsleyjs.org/doc/
    // ***********************************************
    var regVisa = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
    var regMC = /^(?:5[1-5][0-9]{14})$/;
    var regAMEX = /^(?:3[47][0-9]{13})$/;

    win.ParsleyConfig = {};

    win.ParsleyValidator
      // Check `other amount` is valid
      .addValidator('checkAmount', function(value, requirement) {
        // 2 decimals places; allows leading 0 (eg. 0.12);
        var reg = /^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/;
        console.log(requirement);
        return (value.match(reg) && value.match(reg).length > 0);
      }, 10)
      .addMessage("en", "checkAmount", "Please enter a number up to 2 decimal places.")
      // Visa and Master Card client side validation
      .addValidator('visaMcCardNum', function(value, requirement) {
        return (value.match(regVisa) && value.match(regVisa).length > 0) || (value.match(regMC) && value.match(regMC).length > 0) || (value.match(regAMEX) && value.match(regAMEX).length > 0);
      }, 10)
      // Credit card expirary date validation
      .addValidator('ccExpirary', function(value, requirement) {
        var reg = /(0[1-9]|1[0-2])\/[0-9]{2}/;
        return (value.match(reg) && value.match(reg).length > 0);
      }, 10);


    $theForm.parsley().subscribe('parsley:form:validated', function(formInstance) {
      $('#one-line-error').hide();
      calculateHeight();
      if (formInstance.submitEvent !== undefined) {
        formInstance.submitEvent.preventDefault();
      }
      if (!formInstance.isValid()) {
        if ($("#payment-type-row input:checked").val() !== "paypal") {
          $('#one-line-error').show();
        }
      } else {
        var
          $donateButton = $('#donate-btn'),
          donateButtonText = $donateButton.text();

        $('#page-1').add('#page-2').removeClass('hidden').attr('disabled', false);

        function hidePages() {
          $('#page-1').add('#page-2').addClass('hidden').attr('disabled', true);
        }

        $donateButton.prop('disabled', true).html('<i class="fa fa-cog fa-spin"/> Submitting…');

        function prepDonationAmount() {
          // Set donation amount hidden inputs so all APIs are happy
          var selected;
          if ($('input[name="donation_amount_other"]').val() !== '') {
            selected = $('input[name="donation_amount_other"]').val();
          } else {
            selected = $('input[name="donation_amount"]:checked').val()
          }
          $('input[name="amount_other"]').attr('value', selected);
        }

        prepDonationAmount();


        function findCCType(ccNum) {
          if (ccNum.match(regVisa)) {
            return 'vs';
          } else if (ccNum.match(regMC)) {
            return 'mc';
          } else if (ccNum.match(regAMEX)) {
            return 'ax';
          } else {
            return null;
          }
        }

        $('input[name="cc_type_cd"]').attr('value', findCCType($('input[name="cc_number"]').val()));

        function submission400s(XHR, textStatus, error) {
          switch (XHR.responseJSON.code) {
            case 'duplicate':
              $('#one-line-error').text(this.getIntlMessage('dupe_donation')).show();
              break;
            case 'unknown':
              $('#one-line-error').text(this.getIntlMessage('gone_wrong_try_another')).show();
              break;
            case 'gateway':
              switch (XHR.responseJSON.gateway_response.status) {
                case 'decline':
                  $('#one-line-error').text(this.getIntlMessage('declined_card')).show();
                  break;
                case 'failure':
                  $('#one-line-error').text(this.getIntlMessage('fraud_card')).show();
                  break;
                default:
                  $('#one-line-error').text(this.getIntlMessage('gone_wrong_try_another')).show();
              }
              break;
            case 'validation':
              if (XHR.responseJSON.field_errors.length) {
                switch (XHR.responseJSON.field_errors[0].field) {
                  case 'cc_number':
                    $('#one-line-error').text(this.getIntlMessage('invalid_number')).show();
                    break;
                  case 'zip':
                    $('#one-line-error').text(this.getIntlMessage('invalid_zip')).show();
                    break;
                  case 'cc_cvv':
                    $('#one-line-error').text(this.getIntlMessage('invalid_CVC')).show();
                    break;
                  case 'cc_expir_group':
                    $('#one-line-error').text(this.getIntlMessage('expired_card')).show();
                    break;
                  default:
                    $('#one-line-error').text(this.getIntlMessage('gone_wrong_try_another')).show();
                }
                break;
              }
              break;
            default:
              $('#one-line-error').text(this.getIntlMessage('gone_wrong_try_another')).show();
          }
          hidePages();
        }

        Stripe.card.createToken($theForm, function(status, response) {
          if (response.error) {
            // handle all error cases?
            console.log(response.error);
          } else {
            var token = response['id'];
            var formData = {};
            $theForm.serializeArray().map(function(x){formData[x.name] = x.value;});
            var transaction = {
              stripeToken: response['id'],
              amount: formData.amount_other,
              email: formData.email,
              recurring_acknowledge: formData.recurring_acknowledge,
              metadata: {
                firstname: formData.firstname,
                lastname: formData.lastname,
                country: formData.country,
                address: formData.addr1,
                city: formData.city,
                zip: formData.zip,
                state: formData.state_cd
              }
            };
            var submitDonation = $.ajax('/stripe', {
              type: 'POST',
              data: transaction,
              statusCode: {
                400: submission400s,
                500: function(XHR, textStatus, error) {
                  $('#one-line-error').text(this.getIntlMessage('try_again_later')).show();
                  hidePages();
                }
              }
            });

            function submitSuccess(data, textStatus, XHR) {

              var amount = data.amount; // cents
              var currency = data.currency;
              var transactionId = data.id;
              // Todo: need to work out how we identify this status?
              var donationFrequency = 'one-time';

              var params = '?payment=Stripe&str_amount=' + amount + '&str_currency=' + currency + '&str_id=' +transactionId + '&str_frequency=' +donationFrequency;
              var thankYouURL = '/thank-you/' + params;

              if (win.location.assign) {
                win.location.assign(thankYouURL);
              } else {
                win.location = thankYouURL;
              }

            }

            function submitError(XHR, textStatus, error) {
              $donateButton.prop('disabled', false).text(donateButtonText);
            }

            submitDonation.error(submitError).success(submitSuccess);
          }
        });

        $("#one-line-error").hide();
      }
    });
  },
  render: function() {
    return (
      <div>
        <div className="sequential-page mozilla-eoy-donation">
          <Header/>
          <div>
            <div className="form-wrapper container">
              <form id="donation-form-sequential" action="/stripe" method="post" data-parsley-excluded="input[type=button], input[type=submit], input[type=reset], input[type=hidden], [disabled]">
                <ol className="progress">
                  <li data-position="#page-1" className="active">
                    <div>{this.getIntlMessage('amount')}</div>
                    <div className="page-breadcrumb"></div>
                  </li>
                  <li data-position="#page-2">
                    <div>{this.getIntlMessage('payment')}</div>
                    <div className="page-breadcrumb"></div>
                  </li>
                  <li data-position="#page-3">{this.getIntlMessage('personal')}</li>
                </ol>
                {/* = Amount Section ====================  */}
                <fieldset id="page-1" className="sequence-page">
                  <div className="row">
                    <CTA>{this.getIntlMessage("donate_now")}</CTA>
                  </div>
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
                  <div className="row error-msg-row">
                    <div className="full">
                      <div id="amount-error-msg"></div>
                      <div id="amount-other-error-msg"></div>
                    </div>
                  </div>
                  <Frequency/>
                  <div className="row error-msg-row">
                    <div className="full">
                      <div id="recurring-error-msg"></div>
                    </div>
                  </div>
                  <a href="#page-2" data-button-type="next" data-page="1" className="button">
                  {this.getIntlMessage('next')}
                  </a>
                </fieldset>
                {/* = Amount Section Ends ====================  */}
                {/* = Payment Section ====================  */}
                <fieldset id="page-2" className="sequence-page page-hidden-incomplete hidden" disabled>
                  <div className="row">
                    <div className="full">
                      <h2>{this.getIntlMessage('payment')}</h2>
                      <p id="secure-label"><i className="fa fa-lock"></i>{this.getIntlMessage('secure')}</p>
                    </div>
                  </div>
                  <div className="row" id="payment-type-row">
                    <div className="half">
                      <input type="radio" name="payment-type" value="cc" id="payment-cc" data-parsley-group="page-2" data-parsley-multiple="payment-type" data-parsley-errors-container="#payment-type-error-msg" data-parsley-required/>
                      <label id="payment-cc-label" htmlFor="payment-cc">
                        <div className="row payment-logos credit-card-logos">
                          <p>&nbsp;</p>
                        </div>
                        <div className="row medium-label-size">{this.getIntlMessage('credit_card')}</div>
                      </label>
                    </div>
                    <div className="half">
                      <input type="radio" name="payment-type" value="paypal" id="payment-paypal" data-parsley-group="page-2" data-parsley-multiple="payment-type" data-parsley-errors-container="#payment-type-error-msg" data-parsley-required/>
                      <label htmlFor="payment-paypal">
                        <div className="row payment-logos paypal-logo">
                          <p>&nbsp;</p>
                        </div>
                        <div className="row medium-label-size">PayPal</div>
                      </label>
                    </div>
                  </div>
                  {/* Credit Card Info */}
                  <div className="cc-additional-info credit-card-section">
                    <div className="row">
                      <div className="full">
                        <div className="field-container">
                          <i className="fa fa-credit-card field-icon"></i>
                          <input type="tel" name="cc_number" data-stripe="number" placeholder={this.getIntlMessage('credit_card_number')} maxLength="16" data-parsley-group="page-2" autoComplete="off" data-parsley-visa-mc-card-num="" data-parsley-required/>
                        </div>
                      </div>
                    </div>
                    <div className="row hint-msg-parent">
                      <div className="half">
                        <div className="field-container">
                          <i className="fa fa-calendar-o field-icon"></i>
                          <input aria-label={this.getIntlMessage('credit_card_expiration_month')} data-stripe="exp-month" type="tel" placeholder={this.getIntlMessage('MM')} pattern="\\d{2}" maxLength="2" data-parsley-group="page-2" data-parsley-type="digits" data-parsley-required name="cc_expir_month" autoComplete="off"/>
                          &frasl;
                          <input aria-label={this.getIntlMessage('credit_card_expiration_year')} type="tel" data-stripe="exp-year" placeholder={this.getIntlMessage('YY')} pattern="\\d{2}" maxLength="2" data-parsley-group="page-2" data-parsley-type="digits" data-parsley-required name="cc_expir_year" autoComplete="off"/>
                        </div>
                      </div>
                      <div className="half">
                        <div className="field-container">
                          <i className="fa fa-lock field-icon"></i>
                          <input type="tel" name="cc_cvv" maxLength="4" data-stripe="cvc" placeholder={this.getIntlMessage('CVC')} data-parsley-group="page-2" data-parsley-type="digits" data-parsley-required autoComplete="off"/><i className="fa fa-question-circle hint"></i>
                        </div>
                      </div>
                      <div className="full">
                        <div className="hint-msg small">
                          <img src="https://ddz69tinzt56n.cloudfront.net/images/CVC-illustration.png" className="left"/>
                          <div className="">{this.getIntlMessage('cvc_info')}</div>
                        </div>
                      </div>
                    </div>
                    <a href="#page-3" className="button" data-page="2" data-button-type="next">
                    Next
                    </a>
                  </div>
                  {/* Credit Card Info Ends */}
                  <div className="row error-msg-row">
                    <div className="full">
                      <div id="payment-type-error-msg"></div>
                    </div>
                  </div>
                </fieldset>
                {/* = Payment Section Ends ====================  */}
                {/* = Billing Info Section ====================  */}
                <fieldset id="page-3" className="sequence-page page-hidden-incomplete hidden" disabled>
                  <div className="row">
                    <div className="full">
                      <h2>{this.getIntlMessage('personal')}</h2>
                    </div>
                  </div>
                  <div className="billing-info">
                    {/* Full Name Row  */}
                    <div className="row cc-additional-info" id="full-name-row">
                      <div className="half">
                        <div className="field-container">
                          <i className="fa fa-user field-icon"></i>
                          <input type="text" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" name="firstname" placeholder={this.getIntlMessage('first_name')} data-parsley-group="page-3" data-parsley-required/>
                        </div>
                      </div>
                      <div className="half">
                        <div className="field-container">
                          <input type="text" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" name="lastname" placeholder={this.getIntlMessage('last_name')} data-parsley-group="page-3" className="less-indented" data-parsley-required/>
                        </div>
                      </div>
                    </div>
                    {/* Full Name Row Ends  */}
                    {/* Address */}
                    <div className="cc-additional-info address-section">
                      <div className="row">
                        <div className="full">
                          <div className="field-container">
                            <i className="fa fa-map-marker field-icon"></i>
                            <select onChange={this.onCountryChange} name="country" data-parsley-group="page-3" value={this.state.country} data-parsley-required >
                              <option value=""></option>
                              <option value="AF">Afghanistan</option>
                              <option value="AL">Albania</option>
                              <option value="DZ">Algeria</option>
                              <option value="AS">American Samoa</option>
                              <option value="AD">Andorra</option>
                              <option value="AO">Angola</option>
                              <option value="AI">Anguilla</option>
                              <option value="AG">Antigua and Barbuda</option>
                              <option value="AR">Argentina</option>
                              <option value="AM">Armenia</option>
                              <option value="AW">Aruba</option>
                              <option value="AU">Australia</option>
                              <option value="AT">Austria</option>
                              <option value="AZ">Azerbaijan</option>
                              <option value="BS">Bahamas</option>
                              <option value="BH">Bahrain</option>
                              <option value="BD">Bangladesh</option>
                              <option value="BB">Barbados</option>
                              <option value="BY">Belarus</option>
                              <option value="BE">Belgium</option>
                              <option value="BZ">Belize</option>
                              <option value="BJ">Benin</option>
                              <option value="BM">Bermuda</option>
                              <option value="BT">Bhutan</option>
                              <option value="BO">Bolivia</option>
                              <option value="BA">Bosnia and Herzegovina</option>
                              <option value="BW">Botswana</option>
                              <option value="BR">Brazil</option>
                              <option value="VG">British Virgin Islands</option>
                              <option value="IO">British Indian Ocean Territory</option>
                              <option value="BN">Brunei</option>
                              <option value="BG">Bulgaria</option>
                              <option value="BF">Burkina Faso</option>
                              <option value="BI">Burundi</option>
                              <option value="KH">Cambodia</option>
                              <option value="CM">Cameroon</option>
                              <option value="CA">Canada</option>
                              <option value="CV">Cape Verde</option>
                              <option value="KY">Cayman Islands</option>
                              <option value="CF">Central African Republic</option>
                              <option value="TD">Chad</option>
                              <option value="CL">Chile</option>
                              <option value="CN">China</option>
                              <option value="CX">Christmas Island</option>
                              <option value="CO">Colombia</option>
                              <option value="KM">Comoros Islands</option>
                              <option value="CD">Congo, Democratic Republic of the</option>
                              <option value="CG">Congo, Republic of the</option>
                              <option value="CK">Cook Islands</option>
                              <option value="CR">Costa Rica</option>
                              <option value="CI">Cote D&#39;ivoire</option>
                              <option value="HR">Croatia</option>
                              <option value="CY">Cyprus</option>
                              <option value="CZ">Czech Republic</option>
                              <option value="DK">Denmark</option>
                              <option value="DJ">Djibouti</option>
                              <option value="DM">Dominica</option>
                              <option value="DO">Dominican Republic</option>
                              <option value="TP">East Timor</option>
                              <option value="EC">Ecuador</option>
                              <option value="EG">Egypt</option>
                              <option value="SV">El Salvador</option>
                              <option value="GQ">Equatorial Guinea</option>
                              <option value="ER">Eritrea</option>
                              <option value="EE">Estonia</option>
                              <option value="ET">Ethiopia</option>
                              <option value="FK">Falkland Islands (Malvinas)</option>
                              <option value="FO">Faroe Islands</option>
                              <option value="FJ">Fiji</option>
                              <option value="FI">Finland</option>
                              <option value="FR">France</option>
                              <option value="GF">French Guiana</option>
                              <option value="PF">French Polynesia</option>
                              <option value="TF">French Southern Territories</option>
                              <option value="GA">Gabon</option>
                              <option value="GM">Gambia</option>
                              <option value="GE">Georgia</option>
                              <option value="DE">Germany</option>
                              <option value="GH">Ghana</option>
                              <option value="GI">Gibraltar</option>
                              <option value="GR">Greece</option>
                              <option value="GL">Greenland</option>
                              <option value="GD">Grenada</option>
                              <option value="GP">Guadeloupe</option>
                              <option value="GU">Guam</option>
                              <option value="GT">Guatemala</option>
                              <option value="GN">Guinea</option>
                              <option value="GW">Guinea-Bissau</option>
                              <option value="GY">Guyana</option>
                              <option value="HT">Haiti</option>
                              <option value="VA">Holy See (Vatican City State)</option>
                              <option value="HN">Honduras</option>
                              <option value="HK">Hong Kong</option>
                              <option value="HU">Hungary</option>
                              <option value="IS">Iceland</option>
                              <option value="IN">India</option>
                              <option value="ID">Indonesia</option>
                              <option value="IQ">Iraq</option>
                              <option value="IE">Republic of Ireland</option>
                              <option value="IL">Israel</option>
                              <option value="IT">Italy</option>
                              <option value="JM">Jamaica</option>
                              <option value="JP">Japan</option>
                              <option value="JO">Jordan</option>
                              <option value="KZ">Kazakhstan</option>
                              <option value="KE">Kenya</option>
                              <option value="KI">Kiribati</option>
                              <option value="KR">South Korea</option>
                              <option value="XK">Kosovo</option>
                              <option value="KW">Kuwait</option>
                              <option value="KG">Kyrgyzstan</option>
                              <option value="LA">Laos</option>
                              <option value="LV">Latvia</option>
                              <option value="LB">Lebanon</option>
                              <option value="LS">Lesotho</option>
                              <option value="LR">Liberia</option>
                              <option value="LY">Libya</option>
                              <option value="LI">Liechtenstein</option>
                              <option value="LT">Lithuania</option>
                              <option value="LU">Luxembourg</option>
                              <option value="MO">Macau</option>
                              <option value="MK">Macedonia</option>
                              <option value="MG">Madagascar</option>
                              <option value="MW">Malawi</option>
                              <option value="MY">Malaysia</option>
                              <option value="MV">Maldives</option>
                              <option value="ML">Mali</option>
                              <option value="MT">Malta</option>
                              <option value="MH">Marshall Islands</option>
                              <option value="MQ">Martinique</option>
                              <option value="MR">Mauritania</option>
                              <option value="MU">Mauritius</option>
                              <option value="YT">Mayotte</option>
                              <option value="MX">Mexico</option>
                              <option value="FM">Micronesia</option>
                              <option value="MD">Moldova, Republic of</option>
                              <option value="MC">Monaco</option>
                              <option value="MN">Mongolia</option>
                              <option value="ME">Montenegro</option>
                              <option value="MS">Montserrat</option>
                              <option value="MA">Morocco</option>
                              <option value="MZ">Mozambique</option>
                              <option value="MM">Myanmar</option>
                              <option value="NA">Namibia</option>
                              <option value="NR">Nauru</option>
                              <option value="NP">Nepal</option>
                              <option value="NL">Netherlands</option>
                              <option value="AN">Netherlands Antilles</option>
                              <option value="NC">New Caledonia</option>
                              <option value="NZ">New Zealand</option>
                              <option value="NI">Nicaragua</option>
                              <option value="NE">Niger</option>
                              <option value="NG">Nigeria</option>
                              <option value="NU">Niue</option>
                              <option value="NF">Norfolk Island</option>
                              <option value="MP">Northern Mariana Islands</option>
                              <option value="NO">Norway</option>
                              <option value="OM">Oman</option>
                              <option value="PK">Pakistan</option>
                              <option value="PW">Palau</option>
                              <option value="PA">Panama</option>
                              <option value="PG">Papua New Guinea</option>
                              <option value="PY">Paraguay</option>
                              <option value="PE">Peru</option>
                              <option value="PH">Philippines</option>
                              <option value="PN">Pitcairn Island</option>
                              <option value="PL">Poland</option>
                              <option value="PT">Portugal</option>
                              <option value="PR">Puerto Rico</option>
                              <option value="QA">Qatar</option>
                              <option value="RE">Reunion</option>
                              <option value="RO">Romania</option>
                              <option value="RU">Russian Federation</option>
                              <option value="RW">Rwanda</option>
                              <option value="KN">Saint Kitts and Nevis</option>
                              <option value="LC">Saint Lucia</option>
                              <option value="VC">Saint Vincent and the Grenadines</option>
                              <option value="WS">Samoa</option>
                              <option value="SM">San Marino</option>
                              <option value="ST">Sao Tome and Principe</option>
                              <option value="SA">Saudi Arabia</option>
                              <option value="SN">Senegal</option>
                              <option value="RS">Serbia</option>
                              <option value="SC">Seychelles</option>
                              <option value="SL">Sierra Leone</option>
                              <option value="SG">Singapore</option>
                              <option value="SK">Slovakia</option>
                              <option value="SI">Slovenia</option>
                              <option value="SB">Solomon Islands</option>
                              <option value="SO">Somalia</option>
                              <option value="ZA">South Africa</option>
                              <option value="SS">South Sudan</option>
                              <option value="ES">Spain</option>
                              <option value="LK">Sri Lanka</option>
                              <option value="SH">St. Helena</option>
                              <option value="PM">St. Pierre and Miquelon</option>
                              <option value="SR">Suriname</option>
                              <option value="SZ">Swaziland</option>
                              <option value="SE">Sweden</option>
                              <option value="CH">Switzerland</option>
                              <option value="TW">Taiwan</option>
                              <option value="TJ">Tajikistan</option>
                              <option value="TZ">Tanzania</option>
                              <option value="TH">Thailand</option>
                              <option value="TG">Togo</option>
                              <option value="TK">Tokelau</option>
                              <option value="TO">Tonga</option>
                              <option value="TT">Trinidad and Tobago</option>
                              <option value="TN">Tunisia</option>
                              <option value="TR">Turkey</option>
                              <option value="TM">Turkmenistan</option>
                              <option value="TC">Turks and Caicos Islands</option>
                              <option value="TV">Tuvalu</option>
                              <option value="UG">Uganda</option>
                              <option value="UA">Ukraine</option>
                              <option value="AE">United Arab Emirates</option>
                              <option value="GB">United Kingdom</option>
                              <option value="US">United States</option>
                              <option value="UY">Uruguay</option>
                              <option value="UZ">Uzbekistan</option>
                              <option value="VU">Vanuatu</option>
                              <option value="VE">Venezuela</option>
                              <option value="VN">Viet Nam</option>
                              <option value="VI">Virgin Islands (U.S.)</option>
                              <option value="WF">Wallis and Futuna Islands</option>
                              <option value="EH">Western Sahara</option>
                              <option value="YE">Yemen</option>
                              <option value="ZM">Zambia</option>
                              <option value="ZW">Zimbabwe</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="full">
                          <input type="text" name="addr1" placeholder={this.getIntlMessage('address')} data-parsley-group="page-3" data-parsley-required/>
                        </div>
                      </div>
                      <div className="row">
                        <div className="half">
                          <input type="text" name="city" placeholder={this.getIntlMessage('city')} data-parsley-group="page-3" data-parsley-required/>
                        </div>
                        <div className="half">
                          <input type="text" name="zip" placeholder={this.getIntlMessage('postal_code')} className="less-indented" data-parsley-group="page-3" data-parsley-required/>
                        </div>
                      </div>
                      <div className="row">
                        <div className="full">
                          <select onChange={this.onProvinceChange} id="wsstate_cd" value={this.state.province} name="state_cd" autoComplete="billing region" className="">
                            <option value="">{this.getIntlMessage('state_province')}</option>
                          </select>
                          <select className="states-select" data-country="none">
                            <option value="" data-value="none">{this.getIntlMessage('none')}</option>
                          </select>
                          <select className="states-select" data-country="US">
                            <optgroup label="U.S. States and Territories">
                              <option value="AL">Alabama</option>
                              <option value="AK">Alaska</option>
                              <option value="AS">American Samoa</option>
                              <option value="AZ">Arizona</option>
                              <option value="AR">Arkansas</option>
                              <option value="AA">Armed Forces Americas</option>
                              <option value="AE">Armed Forces Europe</option>
                              <option value="AP">Armed Forces Pacific</option>
                              <option value="CA">California</option>
                              <option value="CO">Colorado</option>
                              <option value="CT">Connecticut</option>
                              <option value="DE">Delaware</option>
                              <option value="DC">District of Columbia</option>
                              <option value="FL">Florida</option>
                              <option value="GA">Georgia</option>
                              <option value="GU">Guam</option>
                              <option value="HI">Hawaii</option>
                              <option value="ID">Idaho</option>
                              <option value="IL">Illinois</option>
                              <option value="IN">Indiana</option>
                              <option value="IA">Iowa</option>
                              <option value="KS">Kansas</option>
                              <option value="KY">Kentucky</option>
                              <option value="LA">Louisiana</option>
                              <option value="ME">Maine</option>
                              <option value="MH">Marshall Islands</option>
                              <option value="MD">Maryland</option>
                              <option value="MA">Massachusetts</option>
                              <option value="MI">Michigan</option>
                              <option value="FM">Micronesia</option>
                              <option value="MN">Minnesota</option>
                              <option value="UM">Minor Outlying Islands</option>
                              <option value="MS">Mississippi</option>
                              <option value="MO">Missouri</option>
                              <option value="MT">Montana</option>
                              <option value="NE">Nebraska</option>
                              <option value="NV">Nevada</option>
                              <option value="NH">New Hampshire</option>
                              <option value="NJ">New Jersey</option>
                              <option value="NM">New Mexico</option>
                              <option value="NY">New York</option>
                              <option value="NC">North Carolina</option>
                              <option value="ND">North Dakota</option>
                              <option value="MP">Northern Mariana Islands</option>
                              <option value="OH">Ohio</option>
                              <option value="OK">Oklahoma</option>
                              <option value="OR">Oregon</option>
                              <option value="PW">Palau</option>
                              <option value="PA">Pennsylvania</option>
                              <option value="PR">Puerto Rico</option>
                              <option value="RI">Rhode Island</option>
                              <option value="SC">South Carolina</option>
                              <option value="SD">South Dakota</option>
                              <option value="TN">Tennessee</option>
                              <option value="TX">Texas</option>
                              <option value="UT">Utah</option>
                              <option value="VT">Vermont</option>
                              <option value="VI">Virgin Islands</option>
                              <option value="VA">Virginia</option>
                              <option value="WA">Washington</option>
                              <option value="WV">West Virginia</option>
                              <option value="WI">Wisconsin</option>
                              <option value="WY">Wyoming</option>
                            </optgroup>
                          </select>
                          <select className="states-select" data-country="AU">
                            <optgroup label="Australian States">
                              <option value="Australian Capital Territory">Australian Capital
                                Territory
                              </option>
                              <option value="New South Wales">New South Wales</option>
                              <option value="Northern Territory">Northern Territory</option>
                              <option value="Queensland">Queensland</option>
                              <option value="South Australia">South Australia</option>
                              <option value="Tasmania">Tasmania</option>
                              <option value="Victoria">Victoria</option>
                              <option value="Western Australia">Western Australia</option>
                            </optgroup>
                          </select>
                          <select className="states-select" data-country="BR">
                            <optgroup label="Brazilian States">
                              <option value="AC">Acre</option>
                              <option value="AL">Alagoas</option>
                              <option value="AM">Amazonas</option>
                              <option value="AP">Amapá</option>
                              <option value="BA">Bahia</option>
                              <option value="CE">Ceará</option>
                              <option value="DF">Distrito Federal</option>
                              <option value="ES">Espírito Santo</option>
                              <option value="GO">Goiás</option>
                              <option value="MA">Maranhão</option>
                              <option value="MT">Mato Grosso</option>
                              <option value="MS">Mato Grosso do Sul</option>
                              <option value="MG">Minas Gerais</option>
                              <option value="PA">Pará</option>
                              <option value="PB">Paraíba</option>
                              <option value="PR">Paraná</option>
                              <option value="PE">Pernambuco</option>
                              <option value="PI">Piauí</option>
                              <option value="RJ">Rio de Janeiro</option>
                              <option value="RN">Rio Grande do Norte</option>
                              <option value="RO">Rondônia</option>
                              <option value="RS">Rio Grande do Sul</option>
                              <option value="RR">Roraima</option>
                              <option value="SC">Santa Catarina</option>
                              <option value="SE">Sergipe</option>
                              <option value="SP">São Paulo</option>
                              <option value="TO">Tocantins</option>
                            </optgroup>
                          </select>
                          <select className="states-select" data-country="CA">
                            <optgroup label="Canadian Provinces">
                              <option value="Alberta">Alberta</option>
                              <option value="British Columbia">British Columbia</option>
                              <option value="Manitoba">Manitoba</option>
                              <option value="New Brunswick">New Brunswick</option>
                              <option value="Newfoundland and Labrador">Newfoundland and
                                Labrador
                              </option>
                              <option value="Northwest Territories">Northwest Territories
                              </option>
                              <option value="Nova Scotia">Nova Scotia</option>
                              <option value="Nunavut">Nunavut</option>
                              <option value="Ontario">Ontario</option>
                              <option value="Prince Edward Island">Prince Edward Island</option>
                              <option value="Quebec">Quebec</option>
                              <option value="Saskatchewan">Saskatchewan</option>
                              <option value="Yukon">Yukon</option>
                            </optgroup>
                          </select>
                          <select className="states-select" data-country="IE">
                            <optgroup label="Irish Counties">
                              <option value="Antrim">Antrim</option>
                              <option value="Armagh">Armagh</option>
                              <option value="Carlow">Carlow</option>
                              <option value="Cavan">Cavan</option>
                              <option value="Clare">Clare</option>
                              <option value="Cork">Cork</option>
                              <option value="Derry">Derry</option>
                              <option value="Donegal">Donegal</option>
                              <option value="Down">Down</option>
                              <option value="Dublin">Dublin</option>
                              <option value="Fermanagh">Fermanagh</option>
                              <option value="Galway">Galway</option>
                              <option value="Kerry">Kerry</option>
                              <option value="Kildare">Kildare</option>
                              <option value="Kilkenny">Kilkenny</option>
                              <option value="Laois">Laois</option>
                              <option value="Leitrim">Leitrim</option>
                              <option value="Limerick">Limerick</option>
                              <option value="Longford">Longford</option>
                              <option value="Louth">Louth</option>
                              <option value="Mayo">Mayo</option>
                              <option value="Meath">Meath</option>
                              <option value="Monaghan">Monaghan</option>
                              <option value="Offaly">Offaly</option>
                              <option value="Roscommon">Roscommon</option>
                              <option value="Sligo">Sligo</option>
                              <option value="Tipperary">Tipperary</option>
                              <option value="Tyrone">Tyrone</option>
                              <option value="Waterford">Waterford</option>
                              <option value="Westmeath">Westmeath</option>
                              <option value="Wexford">Wexford</option>
                              <option value="Wicklow">Wicklow</option>
                            </optgroup>
                          </select>
                          <select className="states-select" data-country="MX">
                            <optgroup label="Mexican States">
                              <option value="Aguascalientes">Aguascalientes</option>
                              <option value="Baja California Norte">Baja California Norte
                              </option>
                              <option value="Baja California Sur">Baja California Sur</option>
                              <option value="Campeche">Campeche</option>
                              <option value="Chiapas">Chiapas</option>
                              <option value="Chihuahua">Chihuahua</option>
                              <option value="Coahuila">Coahuila</option>
                              <option value="Colima">Colima</option>
                              <option value="Distrito Federal">Distrito Federal</option>
                              <option value="Durango">Durango</option>
                              <option value="Guanajuato">Guanajuato</option>
                              <option value="Guerrero">Guerrero</option>
                              <option value="Hidalgo">Hidalgo</option>
                              <option value="Jalisco">Jalisco</option>
                              <option value="Mexico (Estado de)">Mexico (Estado de)</option>
                              <option value="Michoacan">Michoacan</option>
                              <option value="Morelos">Morelos</option>
                              <option value="Nayarit">Nayarit</option>
                              <option value="Nuevo Leon">Nuevo Leon</option>
                              <option value="Oaxaca">Oaxaca</option>
                              <option value="Puebla">Puebla</option>
                              <option value="Queretaro">Queretaro</option>
                              <option value="Quintana Roo">Quintana Roo</option>
                              <option value="San Luis Potosi">San Luis Potosi</option>
                              <option value="Sinaloa">Sinaloa</option>
                              <option value="Sonora">Sonora</option>
                              <option value="Tabasco">Tabasco</option>
                              <option value="Tamaulipas">Tamaulipas</option>
                              <option value="Tlaxcala">Tlaxcala</option>
                              <option value="Veracruz">Veracruz</option>
                              <option value="Yucatan">Yucatan</option>
                              <option value="Zacatecas">Zacatecas</option>
                            </optgroup>
                          </select>
                          <select className="states-select" data-country="ZA">
                            <optgroup label="South African Provinces">
                              <option value="Eastern Cape">Eastern Cape</option>
                              <option value="Free State">Free State</option>
                              <option value="Gauteng">Gauteng</option>
                              <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                              <option value="Limpopo">Limpopo</option>
                              <option value="Mpumalanga">Mpumalanga</option>
                              <option value="North West">North West</option>
                              <option value="Northern Cape">Northern Cape</option>
                              <option value="Western Cape">Western Cape</option>
                            </optgroup>
                          </select>
                          <select className="states-select" data-country="SE">
                            <optgroup label="Swedish Provinces">
                              <option value="Blekinge">Blekinge</option>
                              <option value="Dalarna">Dalarna</option>
                              <option value="Gavleborg">Gavleborg</option>
                              <option value="Gotland">Gotland</option>
                              <option value="Halland">Halland</option>
                              <option value="Jamtland">Jamtland</option>
                              <option value="Jonkoping">Jonkoping</option>
                              <option value="Kalmar">Kalmar</option>
                              <option value="Kronoberg">Kronoberg</option>
                              <option value="Norrbotten">Norrbotten</option>
                              <option value="Orebro">Orebro</option>
                              <option value="Ostergotland">Ostergotland</option>
                              <option value="Skane">Skane</option>
                              <option value="Sodermanland">Sodermanland</option>
                              <option value="Stockholm">Stockholm</option>
                              <option value="Uppsala">Uppsala</option>
                              <option value="Varmland">Varmland</option>
                              <option value="Vasterbotten">Vasterbotten</option>
                              <option value="Vasternorrland">Vasternorrland</option>
                              <option value="Vastmanland">Vastmanland</option>
                              <option value="Vastra Gotaland">Vastra Gotaland</option>
                            </optgroup>
                          </select>
                        </div>
                      </div>
                    </div>
                    {/* Address Ends */}
                    {/* Email */}
                    <div className="cc-additional-info" id="email-row">
                      <div className="row hint-msg-parent">
                        <div className="full">
                          <div className="field-container">
                            <i className="fa fa-envelope field-icon"></i>
                            <input type="email" name="email" placeholder={this.getIntlMessage('email')} data-parsley-group="page-3" data-parsley-required/><i className="fa fa-question-circle hint"></i>
                            <div className="hint-msg small">
                              <FormattedHTMLMessage message={ this.getIntlMessage("email_info") } />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Email Ends */}
                  </div>
                  {/* = Billing Info Section Ends ==========  */}
                  {/* = Privacy Policy Section ==========  */}
                  <div id="privacy-policy">
                    <div className="row cc-additional-info">
                      <div className="full">
                        <input type="checkbox" name="legal_confirm" id="legalConfirm" data-parsley-group="page-3" data-parsley-errors-container="#privacy-error-msg" data-parsley-error-message={this.getIntlMessage('pp_acknowledge')} data-parsley-required/><label htmlFor="legalConfirm">
                        <FormattedHTMLMessage message={ this.getIntlMessage("privacy_policy") } />
                        </label>
                      </div>
                    </div>
                    <div className="row cc-additional-info error-msg-row">
                      <div className="full">
                        <div id="privacy-error-msg"></div>
                      </div>
                    </div>
                  </div>
                  {/* = Privacy Policy Section Ends ==========  */}
                  {/* = Submit Button ==========  */}
                  <div>
                    <div className="row">
                      <div className="full">
                        <button type="submit" className="btn large-label-size" id="donate-btn">
                        {this.getIntlMessage("donate_now")}
                        </button>
                      </div>
                    </div>
                  </div>
                </fieldset>
                {/* = One Line Error Message ==========  */}
                <div>
                  <div className="row">
                    <div className="full" id="one-line-error">
                      <p>{this.getIntlMessage('please_complete')}.</p>
                    </div>
                  </div>
                </div>
                {/* = One Line Error Message Ends ==========  */}
                {/* = Submit Button Ends ==========  */}
                <input type="hidden" name="bp_load_counter" value="1"/>
                <input type="hidden" name="cc_type_cd" value=""/>
                <input type="hidden" name="amount" value="other"/>
                <input type="hidden" name="amount_other" value=""/>
              </form>
            </div>
            <div className="row disclaimers">
              <p className="other_ways_to_give">
                <small>
                  Other ways to give: <Link to='give-bitcoin'>Bitcoin</Link> |
                  <a target='_blank' href='https://wiki.mozilla.org/Ways_to_Give#Check_.28via_postal_service.29'>Check</a>
                </small>
              </p>
              <p className="need-help">
                <small><FormattedHTMLMessage message={ this.getIntlMessage("problems_donating") } />
                  </small>
              </p>
              <p className="donation-notice">
                <small>{this.getIntlMessage('donation_notice')}</small>
              </p>
              <p className="stripe-notice">
                <small><FormattedHTMLMessage message={ this.getIntlMessage("stripe_notice") } /></small>
              </p>
            </div>
          </div>
          <form action="/paypal-one-time" method="post" target="_top" id="paypal-one-time">
            <input type="hidden" name="lc" value="US"/>
            <input type="hidden" name="currency_code" value="USD"/>
            {/* Donation Amount */}
            <input type="hidden" name="amount" value="3"/>
          </form>
          <form action="/paypal-recurring" method="post" id="paypal-recurring">
            <input type="hidden" name="lc" value="US"/>
            <input type="hidden" name="custom" value="20140923 eoy14 sequential"/>
            <input type="hidden" name="currency_code" value="USD"/>
            {/* Donation Amount */}
            <input type="hidden" name="amount" value="3"/>
          </form>
        </div>
        <Footer/>
      </div>
    );
  }
});

module.exports = Sequential;
