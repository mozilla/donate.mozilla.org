# QA Checklist

## Sandbox account credentials

If you are using the PayPal or Stripe sandbox accounts in [sample.env](../sample.env) then you can use the following credentials/credit cards for QA

### Paypal accounts

- Email - **send-donation2@test.com**
- Password - **TestTestTest**

### Stripe credit cards

- Visa **4242 4242 4242 4242**
- Expiry date - Any future date ie **01/19**
- CVC - Any 3 digit number ie **123**
- First Name - Any name ie **Mary**
- Last Name - Any name ie **Roe**
- Country - Any country ie **Canada**
- Address - Any address ie **366 Adelaide St W**
- City - Any city ie **Toronto**
- Zip/Postal code - Any zip/postal code ie **M5V 1R9**
- State/Province - Any state/province ie **Ontario**
- Email - Any email ie **maryroe@example.org**

Stripe also provides many other [test credit cards](https://stripe.com/docs/testing#cards) for other brands and Stripe error messages.

## Flows

### PayPal one-time donation flow

1. Visit [/](http://localhost:3000/)
2. Select a donation amount
3. Click the Next button
4. Click the PayPal button
5. Ensure you are redirected to PayPal
5. Sign-in to a sandbox PayPal account
6. Click the Pay Now button
7. Ensure you are redirected to [/thank-you/](http://localhost:3000/thank-you/)

### Stripe one-time donation flow

1. Visit [/](http://localhost:3000/)
2. Select a donation amount
3. Click the Next button
4. Click the Credit card button
5. Fill in the credit card number, expiry date, and CVC
6. Click the Next button
7. Fill in the name, address and email
8. Click the privacy checkbox
9. Click the Donate now checkbox
10. Ensure you are redirected to [/thank-you/](http://localhost:3000/thank-you/)

### Email sign-up flow

1. Visit [/thank-you/](http://localhost:3000/thank-you/)
2. Enter an email address
3. Click the privacy checkbox
4. Click the Sign up now button
5. Ensure you are redirected to [/share/](http://localhost:3000/share/)


### Variables to test

1. Currencies - e.g. USD / EUR / GPB - do the correct currencies get passed to Stripe and Paypal?
2. Onetime / Monthly - does the correct donation frequency get passed to Stripe and Paypal?
3. Amount - does the correct amount (selected in input) get passed to Stripe and Paypal?
4. Language - does the form work the same in multiple languages (e.g. `/en-US/` or `/de`)
5. Form variations
  * Root: https://donate.mofostaging.net/en-US/
  * One-page: https://donate.mofostaging.net/en-US/one-page/
  * Simple PayPal: https://donate.mofostaging.net/en-US/paypal-donate/
