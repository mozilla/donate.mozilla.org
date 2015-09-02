import React from 'react';
import {IntlMixin, FormattedHTMLMessage} from 'react-intl';

var Form = React.createClass({
  mixins: [IntlMixin],
  componentDidMount: function() {
    var
        $opt_in = $('label[for="opt_in"]'),
        $email = $('#email'),
        donator_email = donator_email || undefined;

    $opt_in.find('label').prepend('<span className="required">* ');

    $email
        .attr('aria-label', 'Email Address');

    if (donator_email !== undefined) {
      $email.val(donator_email).attr('value',donator_email);
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
        <div className="form-wrapper container">
          <div className="wrap">
            <div className="row">
              <h2>{this.getIntlMessage('sign_up_for_email')}</h2>

              <h5>
                {this.getIntlMessage('dont_miss_important_news')}
              </h5>

            </div>
          </div>


          <div className="wrap">
            <div className="row">
              <form id="signup" action="/api/signup" method="post">
                <div className="input">
                  <input data-parsley-required className="text" size="48" id="email" name="email" type="email" placeholder={this.getIntlMessage('your_email')}>
                    <i className="fa fa-envelope field-icon"></i>
                  </input>
                </div>
                <div className="input">
                  <input data-parsley-required id="opt_in" name="opt_in" type="checkbox" value="1">
                    <label htmlFor="opt_in"> <label className="field" htmlFor="opt_in"><FormattedHTMLMessage message={this.getIntlMessage('i_am_okay_with')} /></label></label>
                  </input>
                </div>
                <input name="submit-btn" value={this.getIntlMessage('sign_up_now')} type="submit"/>
                <input name="redirect_url" value="" type="hidden"/>
                <input name="language_code" value={this.props.language} type="hidden"/>
                <input id="_guid" name="_guid" value="" type="hidden"/>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Form;
