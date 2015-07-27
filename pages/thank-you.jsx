import React from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import { FormattedHTMLMessage, IntlMixin } from 'react-intl';

var ThankYou = React.createClass({
  mixins: [IntlMixin],
  componentDidMount: function() {
    var
        $opt_in = $('label[for="opt_in"]'),
        $email = $('#email'),
        donator_email = donator_email || undefined,
        donator_name = donator_name || undefined;

    $opt_in.find('label').prepend('<span className="required">* ');

    $email
        .attr('aria-label', 'Email Address');

    if (donator_email !== undefined) {
      $email.val(donator_email).attr('value',donator_email);
    }

    if (donator_name !== undefined) {
      $('#header-copy').find('h2').html('<em>Thank you, ' + donator_name);
    }

    $('#signup').parsley().subscribe("parsley:form:validate", function (formInstance) {
      if (!formInstance.isValid()) {
        formInstance.submitEvent.preventDefault();
      }
    });
  },
  render: function() {
    return (
      <div>
        <div className="mozilla-eoy-donation">
          <Header/>
          <div>
            <div id="header-copy">
              <div className="row">
                <h1>{ this.getIntlMessage("From_all_of_us_at_Mozilla") }</h1>

                <h2>
                  <FormattedHTMLMessage
                    message={ this.getIntlMessage("Thank_you_for_your_donation") }
                  />
                </h2>
              </div>
            </div>

            <div className="form-wrapper container">
              <div className="wrap">
                <div className="row">
                  <h2>Sign up for email updates</h2>

                  <h5>
                    Don&rsquo;t miss important news about the work your donation makes possible.
                  </h5>

                </div>
              </div>


              <div className="wrap">
                <div className="row">
                  <form id="signup" action="/signup" method="post">
                    <div className="input">
                      <input data-parsley-required className="text" size="48" id="email" name="email" type="email" placeholder="youremail@example.com">
                        <i className="fa fa-envelope field-icon"></i>
                      </input>
                    </div>
                    <div className="input">
                      <input data-parsley-required id="opt_in" name="opt_in" type="checkbox" value="1">
                        <label htmlFor="opt_in"> <label className="field" htmlFor="opt_in">I'm okay with you handling this info as you explain in your <a href="https://www.mozilla.org/en-US/privacy/">privacy policy</a>.</label></label>
                      </input>
                    </div>
                    <input name="submit-btn" value="Sign up now" type="submit"/>
                    <input name="redirect_url" value="" type="hidden"/>
                    <input id="_guid" name="_guid" value="" type="hidden"/>
                  </form>
                </div>
              </div>
            </div>
            <Footer/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ThankYou;
