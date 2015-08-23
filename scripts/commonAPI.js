var reactGA = require('react-ga');

module.exports = {
  // ***********************************************
  // Update Donate button to make it show the selected donation amount
  // ***********************************************
  updateDonateButtonText: function(amountSelected) {
    var buttonText;
    var locale = 'US';
    var recurring = $('[name=\'recurring_acknowledge\']:checked').val() === '1';
    if (amountSelected && locale === 'US') {
      if (recurring) {
        buttonText = 'Donate $' + amountSelected + ' monthly';
      } else {
        buttonText = 'Donate $' + amountSelected + ' now';
      }
    } else {
      if (recurring) {
        buttonText = this.getIntlMessage('donate_monthly');
      } else {
        buttonText = this.getIntlMessage('donate_now');
      }
    }
    $('#donate-btn').text(buttonText);
  },
  showCreditCardForm: function() {
    $('.not-required-paypal').attr('required', true).attr('data-parsley-required', 'true');
    $('.cc-additional-info').show();
    this.calculateHeight();
    $('.stripe-notice').show();
    window.setTimeout(function() {
      $('[name=\'cc_number\']').focus();
    }, 500);
    if ($('.parsley-error').length > 0) {
      $('#one-line-error').show();
    }
  },
  calculateHeight: function() {
    if (!window.location.hash) {
      return;
    }
    $('.sequence-page-container').height($(window.location.hash).height());
  },
  // ***********************************************
  // Program next links and back button
  // ***********************************************
  hidePage: function(page, status) {
    $(page).addClass('page-hidden-' + status);
    var amount;
    if (page === '#page-1') {
      if (status === 'complete') {
        amount = '$' + $('#donation-form').find('[name=\'donation_amount\']:checked').val();
        $('[data-position=\'#page-1\'] .page-breadcrumb').text(amount);
      } else {
        $('[data-position=\'#page-1\'] .page-breadcrumb').text('');
      }
    } else if (page === '#page-2') {
      if (status === 'complete') {
        $('[data-position=\'#page-2\'] .page-breadcrumb').text('Credit card');
      } else {
        $('[data-position=\'#page-2\'] .page-breadcrumb').text('');
      }
    }
    window.setTimeout(function() {
      $(page).addClass('hidden');
    }, 501);
  },
  showPage: function(page) {
    $('ol.progress').find('li').removeClass('active');
    $('ol.progress').find('li[data-position=\'' + page + '\']').addClass('active');

    $('[data-position=\'' + page + '\'] .page-breadcrumb').text('');

    $(page).removeClass('hidden');
    $(page).prop('disabled', false);
    window.setTimeout(function() {
      $(page).removeClass('page-hidden-incomplete').removeClass('page-hidden-complete');
    }, 100);

    this.calculateHeight();

    // Reset progress bar dots' cursor type accordlying
    $('.progress li').css({
      cursor: 'default'
    });
    $('.progress li.active').prevAll('li').css({
      cursor: 'pointer'
    });

    // These are virtual pageviews, so we track them manually in GA
    var currentPage = window.location.pathname;
    reactGA.pageview(currentPage + page);
  }
};
