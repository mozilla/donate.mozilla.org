var MailchimpMixin = {
  mixins: [require('./signup.js')],
  thundebirdSignupSuccess: function(result) {
    this.doSignupSuccess(result, '/thunderbird/share/');
  },
  mailchimp: function(props) {
    this.doSignup("/api/signup/mailchimp", props, this.thundebirdSignupSuccess, this.signupError);
  }
};

module.exports = MailchimpMixin;
