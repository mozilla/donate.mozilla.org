import { combineReducers } from 'redux';
import donateForm from './donate-form.js';
import signupForm from './signup-form.js';

export default combineReducers({
  donateForm,
  signupForm
});
