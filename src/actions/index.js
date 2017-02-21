export function setFrequency(data) {
  return { type: 'SET_FREQUENCY', data };
}

export function setAmount(data) {
  return { type: 'SET_AMOUNT', data };
}

export function setAmountError(data) {
  return { type: 'SET_AMOUNT_ERROR', data };
}

export function setCurrency(data) {
  return { type: 'SET_CURRENCY', data };
}

export function setPrivacyPolicy(data) {
  return { type: 'SET_PRIVACY_POLICY', data };
}

export function setPrivacyPolicyError(data) {
  return { type: 'SET_PRIVACY_POLICY_ERROR', data };
}

export function setEmail(data) {
  return { type: 'SET_EMAIL', data };
}

export function setEmailError(data) {
  return { type: 'SET_EMAIL_ERROR', data };
}
