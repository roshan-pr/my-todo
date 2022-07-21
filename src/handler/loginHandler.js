const { createLoginPage } = require('../view/loginPage.js');

const assignSession = req => {
  const timeStamp = new Date().getTime();
  req.session.id = timeStamp;
  req.session.name = req.body.name;
};

const isValidUser = (req) => {
  const { users, body: { name, password } } = req;
  if (!users[name]) {
    return false;
  }
  return users[name].password === password;
};

const redirectToTodo = res => res.redirect('/todo');

const serveErrorPage = res => {
  const loginPage = createLoginPage('Invalid username or password');
  res.end(loginPage);
}

const loginUser = (req, res) => {
  if (!isValidUser(req)) {
    serveErrorPage(res);
    return;
  }
  assignSession(req);
  redirectToTodo(res);
  return;
};

module.exports = { loginUser };
