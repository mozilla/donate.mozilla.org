const Boom = require('boom');
const hatchet = require('hatchet');
const url = process.env.SIGNUP;

async function signupRoutes(transaction) {
  console.log(transaction);
  const form = {
    format: 'html',
    lang: transaction.locale,
    newsletters: 'mozilla-foundation',
    trigger_welcome: 'N',
    source_url: 'https://donate.mozilla.org/',
    email: transaction.email,
    country: transaction.country
  };

  return new Promise((resolve, reject) => {
    hatchet.send(
      "send_post_request",
      { url, form, json: true },
      (err, response) => {
        if (err) {
          return reject(err);
        }

        resolve(form);
      }
    );
  });
}

module.exports = async function(request, h) {
  const transaction = request.payload;
  console.log(request.payload);
  const signup_service = Date.now();
  let form;

  try {
    form = await signupRoutes(transaction);
  } catch (err) {
    request.log(['error', 'signup'], {
      request_id: request.headers['x-request-id'],
      service: Date.now() - signup_service,
      code: err.code,
      type: err.type,
      param: err.param
    });

    return Boom.boomify(err, 500, 'Unable to complete Basket signup');
  }

  request.log(['signup'], {
    request_id: request.headers['x-request-id'],
    service: Date.now() - signup_service
  });

  return h.response(form).code(201);
};
