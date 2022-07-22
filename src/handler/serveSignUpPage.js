const { createSignUpPage } = require('../view/signupPage.js');

const serveSignupPage = (message = '') => (req, res) => {
  const signupPage = createSignUpPage(message);
  res.end(signupPage);
  return;
};

module.exports = { serveSignupPage };
