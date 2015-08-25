# Donation Components

The goal of our components is to allow easy and fast changes to our donation form so we can stand up good AB tests quickly. Because, we can then easily move them around and share their code between multiple tests. Maintain a component in one place, while multiple tests are using it.

## Form Components

These are components that handle data input. Example: fields like name, email, and donation amount. They handle their own state and validation behind an API.

### amount-buttons.jsx

Gets a donation amount from the user. Four static donation amount buttons, and a custom amount button.

### donation-frequency.jsx

Gets the donation frequency from the user, like montly or one-time.

### credit-card-info.jsx

Inputs for credit card number, expiration date, and cvc code.

### name-input.jsx

Inputs for first and last name.

### address-input.jsx

Inputs for address, country, province/state, and postal/zip code. Handles toggling state/province dropdown depending on the selected country.

### email-input.jsx

Just a single input for email.

### privacy-policy-input.jsx

Single checkbox for users accepting our privacy policy.

## Form Submission Components

Buttons that handle submission of a donation to the server.

### credit-card-button.jsx

A button for chosing credit card as a payment. Doesn't usually submit, but just moves the form along to get more info, but could submit directly if enough info has already been collected.

### paypal-button.jsx

Redirects to paypal to PayPal with donation amount and frequency, but could be setup to move to a next step.

### stripe-button.jsx

Opens Stripe widget to accept a donation, similar to the PayPal redirect.

### donate-button.jsx

A button that generally submits a donation to Stripe, this looks and works different than `credit-card-button.jsx`, in that it displays "donate now", and looks like a button and not a toggled state between tow kinds of payment providers. This is intended for use after a payment provided has been selected by the user.

## Navigation Components

Components that handle navigation between sequences, or pages. Like a newxt button, a sequence menu, or the actual displayed sequence and navigating between them.

### navigation-button.jsx

Button in the navigation header that handles going back to complete sequence pages.

### navigation-page.jsx

Displays child content as a single page, and handles the transition between multiple pages.

### next-button.jsx

Button that handles moving forward to incomplete sequence pages.

## Layout Components

Just static UI components like header, footer, and basic containers.

### navigation-container.jsx

Wraps all the navigation pages, and handles resizing of the page based on the new page content.

### navigation-menu.jsx

Just a simple bit of wrapper around the header navigation back buttons.

### footer.jsx

Static footer for the bottom of the page.

### header.jsx

Static header for the top of the page.

### section-heading.jsx

Displays header text, usually for the top of a sequence page.
