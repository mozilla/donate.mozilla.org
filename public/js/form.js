var
  $bsdForm = $("form#contribution"),
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
}

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
$bsdForm.hide();
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
  win.setTimeout(function() {
    calculateHeight();
    $('[name="cc_number"]').focus();
  }, 100);
  if ($(".parsley-error").length > 0) {
    $("#one-line-error").show();
  }
}

$("#payment-type-row label").click(function() {
  // reset
  $(".cc-additional-info").hide();
  // toggle corresponding section
  var paymentType = $(this).attr("for");
  if (paymentType == "payment-cc") {
    showCreditCardForm();
  } else {
    calculateHeight();
    $("#one-line-error").hide();
    if ($('[name="recurring_acknowledge"]:checked').val() === '0') {
      $('#paypal-one-time').submit();
    } else {
      $('#paypal-recurring').submit();
    }
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
  var cloned = $bsdForm.find("select[name='country']").clone();
  $theForm.find("select[name='country']").html(cloned.html());
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
// Extract BSD form meta and insert to our form
// ***********************************************
function insertFormMetaDOM() {
  // the following is an array of all the meta form field names that came with the BSD generated form
  // API doc here: https://github.com/bluestatedigital/bsd-developer-docs/blob/master/bsd-donate-api/README.md
  var bsdFormMetaName = [
    "slug",
    "submission_key",
    "http_referer",
    "event_attendee_id",
    "outreach_page_id",
    "stg_signup_id",
    "mailing_link_id",
    "mailing_recipient_id",
    "match_campaign_id",
    "match_is_pledge",
    "pledge_is_convert",
    "contributor_key",
    "quick_donate_populated",
    "device_fingerprint",
    "default_country",
    "cc_number_ack",
    "ach_account_number_ack",
    "k-ris-sid",
  ];

  $.each(bsdFormMetaName, function(index, value) {
    $theForm.prepend($bsdForm.find("[name='" + value + "']").clone());
  });

}
insertFormMetaDOM();


// ***********************************************
// Remove the BSD generated form from DOM
// ***********************************************
$bsdForm.remove();

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
    buttonText = "Donate now";
  }
  $("#donate-btn").text(buttonText);
  $('#paypal-one-time').find('[name="amount"]').attr('value', amountSelected);
  $('#paypal-recurring').find('[name="a3"]').attr('value', amountSelected);
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
    $(page).addClass('hidden')
  }, 501);
}

function showPage(page) {
  $('ol.progress').find('li').removeClass('active');
  $('ol.progress').find('li[data-position="' + page + '"]').addClass('active');

  $("[data-position='" + page + "'] .page-breadcrumb").text("");

  $(page).removeClass('hidden');
  win.setTimeout(function() {
    $(page).removeClass('page-hidden-incomplete').removeClass('page-hidden-complete').prop('disabled', false);
  }, 100);

  calculateHeight();

  // Reset progress bar dots' cursor type accordlying
  $(".progress li").css({
    cursor: "default"
  });
  $(".progress li.active").prevAll("li").css({
    cursor: "pointer"
  });
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
          $('#one-line-error').text("Looks like we already have your donation—please refresh if you wish to donate again").show();
          break;
        case 'unknown':
          $('#one-line-error').text("Something went wrong with your transaction. Please verify your card details or try another card").show();
          break;
        case 'gateway':
          switch (XHR.responseJSON.gateway_response.status) {
            case 'decline':
              $('#one-line-error').text("Sorry, your card was declined. Please verify your card details or try another card").show();
              break;
            case 'failure':
              $('#one-line-error').text("Sorry, your transaction was flagged for fraud protection. Please try another card").show();
              break;
            default:
              $('#one-line-error').text("Something seems to have gone wrong. Please verify your card details or try another card").show();
          }
          break;
        case 'validation':
          if (XHR.responseJSON.field_errors.length) {
            switch (XHR.responseJSON.field_errors[0].field) {
              case 'cc_number':
                $('#one-line-error').text("Invalid credit card number").show();
                break;
              case 'zip':
                $('#one-line-error').text("Invalid zip/postal code").show();
                break;
              case 'cc_cvv':
                $('#one-line-error').text("Invalid CVC number").show();
                break;
              case 'cc_expir_group':
                $('#one-line-error').text("Sorry, your card has expired. Please verify your card details or try another card").show();
                break;
              default:
                $('#one-line-error').text("Something seems to have gone wrong. Please verify your card details or try another card").show();
            }
            break;
          }
          break;
        default:
          $('#one-line-error').text("Something seems to have gone wrong. Please try again later").show();
      }
      hidePages();
    }

    Stripe.card.createToken($theForm, function(status, response) {
      if (response.error) {
        // handle all error cases?
      } else {
        var token = response['id'];
        $theForm.append("<input type='hidden' name='stripeToken' value='" + token + "'/>");
        var submitDonation = $.ajax('/stripe', {
          type: 'POST',
          data: $theForm.serializeArray(),
          statusCode: {
            400: submission400s,
            500: function(XHR, textStatus, error) {
              $('#one-line-error').text("Something seems to have gone wrong. Please try again later").show();
              hidePages();
            }
          }
        });

        function submitSuccess(data, textStatus, XHR) {
          if (win.location.assign) {
            win.location.assign("http://localhost:2015/givenow-seq/thank-you.html");
          } else {
            win.location = "http://localhost:2015/givenow-seq/thank-you.html";
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
