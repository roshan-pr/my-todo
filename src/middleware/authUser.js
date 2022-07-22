const { serveLoginPage } = require('../handler/serveLoginPage.js');

const authUser = (req, res, next) => {
  const { users, body: { name, password } } = req;
  const user = users[name];
  if (!user || user.password !== password) {
    const loginPage = serveLoginPage('Invalid username or password!');
    loginPage(req, res);
    return;
  }
  next();
};

module.exports = { authUser };
