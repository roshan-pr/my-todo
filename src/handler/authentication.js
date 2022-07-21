const express = require('express');
const { createLoginPage } = require('../view/loginPage.js');
const { loginUser } = require('./loginHandler');

const serveLoginPage = (req, res, next) => {
  const loginPage = createLoginPage();
  res.end(loginPage);
  return;
};

const injectUser = (users) =>
  (req, res, next) => { req.users = users; next(); };

const serveSignupPage = (req, res, next) => {
  req.url = '/signup.html';
  next();
};

const createAuthRouter = (users) => {
  const authRouter = express.Router();
  authRouter.get('/login', serveLoginPage);

  authRouter.use(injectUser(users));
  authRouter.post('/login', loginUser);
  authRouter.get('/signup', serveSignupPage);
  return authRouter;
}

module.exports = createAuthRouter;
