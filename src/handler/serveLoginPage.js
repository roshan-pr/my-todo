const { createLoginPage } = require('../view/loginPage.js');

const serveLoginPage = (message = '') => (req, res) => {
  const loginPage = createLoginPage(message);
  res.end(loginPage);
  return;
};

module.exports = { serveLoginPage };
