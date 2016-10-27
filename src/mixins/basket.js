var BasketMixin = {
  mixins: [require('./signup.js')],
  signupSuccess: function(result) {
    this.doSignupSuccess(result, '/share/');
  },
  basket: function(props) {
    this.doSignup("/api/signup/basket", props, this.signupSuccess, this.signupError);
  }
};

module.exports = BasketMixin;

