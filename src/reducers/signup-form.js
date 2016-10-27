import assign from 'object-assign';

const initialState = {
  privacyPolicy: false,
  email: '',
  emailError: ""
};

const signupApp = (state = initialState, action) => {
  switch (action.type) {
  case 'SET_PRIVACY_POLICY':
    return assign({}, state, {
      privacyPolicy: action.data,
      privacyPolicyError: ""
    });
  case 'SET_PRIVACY_POLICY_ERROR':
    return assign({}, state, {
      privacyPolicyError: action.data
    });
  case 'SET_EMAIL':
    return assign({}, state, {
      email: action.data,
      emailError: ""
    });
  case 'SET_EMAIL_ERROR':
    return assign({}, state, {
      emailError: action.data
    });
  default:
    return state;
  }
};

export default signupApp;
