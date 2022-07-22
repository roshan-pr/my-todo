const { serveSignupPage } = require("../handler/serveSignUpPage");

const existingUser = (req, res, next) => {
  const { users, body: { name } } = req;
  if (users[name]) {
    const signupPage = serveSignupPage('Username exists, try another name.');
    signupPage(req, res);
    return;
  }
  next();
};

module.exports = { existingUser };
