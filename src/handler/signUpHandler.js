const { createSignUpPage } = require('../view/signupPage.js');

const isUsernameExists = (req) => {
  const { users, body: { name } } = req;

  return users[name];
};

const serveErrorPage = res => {
  const signUpPage = createSignUpPage('Try another username!');
  res.end(signUpPage);
};

const signUpUser = (req, res, next) => {
  if (isUsernameExists(req)) {
    serveErrorPage(res);
    return;
  }
  const { users, body: { name, password } } = req;
  users[name] = { name, password };

  const todo = req.todo;
  todo[name] = { lists: [], lastListId: 0 }
  next();
};

module.exports = { signUpUser };
